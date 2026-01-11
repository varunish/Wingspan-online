import { PowerParser } from "./PowerParser.js";

export class WhenActivated {
  static execute({ bird, player, game }) {
    if (!bird.power || bird.power.type !== "WHEN_ACTIVATED") return null;

    console.log(`[WhenActivated] Executing power for ${bird.name}:`, bird.power.effect);

    // Parse the power text to get structured effect data
    const parsed = PowerParser.parse(bird.power);
    const effectType = parsed.effectType;
    const params = parsed.params;

    console.log(`[WhenActivated] Parsed effectType: ${effectType}, params:`, params);

    // Legacy support - check if effect is already a structured type
    const effect = typeof bird.power.effect === 'string' && !bird.power.effect.includes(' ') 
      ? bird.power.effect 
      : effectType;
    const value = bird.power.value || params.count || 1;

    console.log(`[WhenActivated] Using effect: ${effect}, value: ${value}`);

    let message = null;
    
    switch (effect) {
      case "LAY_EGG":
        const capacity = bird.eggCapacity || 6;
        if (bird.eggs < capacity) {
          bird.eggs += value;
          message = `⚡ ${bird.name} laid ${value} egg(s)!`;
          game.logs.push(
            `${player.name} lays ${value} egg(s) on ${bird.name} (power activated)`
          );
        }
        break;

      case "GAIN_FOOD": {
        const foodType = bird.power.food || "wild";
        if (foodType === "wild") {
          // Player can choose any food from dice tray
          // For now, auto-select first available
          if (game.diceTray && game.diceTray.dice && game.diceTray.dice.length > 0) {
            const food = game.diceTray.take(game.diceTray.dice[0]);
            player.food[food] = (player.food[food] || 0) + 1;
            message = `⚡ ${bird.name} gained 1 ${food}!`;
            game.logs.push(`${player.name} gains 1 ${food} from ${bird.name} (power activated)`);
          }
        } else {
          player.food[foodType] = (player.food[foodType] || 0) + value;
          message = `⚡ ${bird.name} gained ${value} ${foodType}!`;
          game.logs.push(`${player.name} gains ${value} ${foodType} from ${bird.name} (power activated)`);
        }
        break;
      }

      case "DRAW_CARD": {
        const drawn = game.deck.draw(value);
        if (Array.isArray(drawn)) {
          player.hand.push(...drawn);
          message = `⚡ ${bird.name} drew ${drawn.length} card(s)!`;
        } else if (drawn) {
          player.hand.push(drawn);
          message = `⚡ ${bird.name} drew 1 card!`;
        }
        // Enforce hand limit
        if (player.hand.length > 8) {
          player.hand = player.hand.slice(0, 8);
        }
        game.logs.push(`${player.name} draws ${value} card(s) from ${bird.name} (power activated)`);
        break;
      }

      case "CACHE_FOOD": {
        // Cache food from supply onto this bird
        const foodType = bird.power.food || "wild";
        if (foodType === "wild") {
          // For now, cache from dice tray
          if (game.diceTray && game.diceTray.dice && game.diceTray.dice.length > 0) {
            const food = game.diceTray.take(game.diceTray.dice[0]);
            bird.cachedFood = bird.cachedFood || [];
            bird.cachedFood.push(food);
            message = `⚡ ${bird.name} cached 1 ${food}!`;
            game.logs.push(`${player.name} caches 1 ${food} on ${bird.name} (power activated)`);
          }
        }
        break;
      }

      case "TUCK_CARD": {
        // Tuck a card from hand under this bird
        if (player.hand.length > 0) {
          const tuckedCard = player.hand.pop();
          bird.tuckedCards = bird.tuckedCards || [];
          bird.tuckedCards.push(tuckedCard);
          message = `⚡ ${bird.name} tucked a card!`;
          game.logs.push(`${player.name} tucks a card under ${bird.name} (power activated)`);
        }
        break;
      }

      case "CONDITIONAL_TUCK": {
        // Look at card from deck, tuck if wingspan < threshold
        const maxWingspan = params.maxWingspan || 75;
        const drawnCard = game.deck.draw();
        if (drawnCard) {
          const wingspan = drawnCard.wingspan || 0;
          if (wingspan < maxWingspan) {
            bird.tuckedCards = bird.tuckedCards || [];
            bird.tuckedCards.push(drawnCard);
            message = `⚡ ${bird.name} tucked ${drawnCard.name} (${wingspan}cm)!`;
            game.logs.push(`${player.name} tucked ${drawnCard.name} under ${bird.name} (power activated)`);
          } else {
            game.logs.push(`${player.name} looked at ${drawnCard.name} (${wingspan}cm) but discarded it (power activated)`);
            message = `⚡ ${bird.name} checked ${drawnCard.name} (${wingspan}cm) - too large, discarded`;
          }
        }
        break;
      }

      case "TUCK_AND_LAY_EGG": {
        // Tuck a card from hand and lay an egg
        if (player.hand.length > 0) {
          const tuckedCard = player.hand.pop();
          bird.tuckedCards = bird.tuckedCards || [];
          bird.tuckedCards.push(tuckedCard);
          
          const capacity = bird.eggCapacity || 6;
          if (bird.eggs < capacity) {
            bird.eggs += 1;
            message = `⚡ ${bird.name} tucked a card and laid 1 egg!`;
            game.logs.push(`${player.name} tucks a card under ${bird.name} and lays 1 egg (power activated)`);
          } else {
            message = `⚡ ${bird.name} tucked a card (no room for egg)!`;
            game.logs.push(`${player.name} tucks a card under ${bird.name} (power activated)`);
          }
        }
        break;
      }

      case "ALL_PLAYERS_DRAW": {
        // All players draw cards
        const count = params.count || 1;
        game.players.forEach(p => {
          const drawn = game.deck.draw(count);
          if (Array.isArray(drawn)) {
            p.hand.push(...drawn);
          } else if (drawn) {
            p.hand.push(drawn);
          }
          // Enforce hand limit
          if (p.hand.length > 8) {
            p.hand = p.hand.slice(0, 8);
          }
        });
        message = `⚡ ${bird.name} caused all players to draw ${count} card(s)!`;
        game.logs.push(`${player.name}'s ${bird.name} power: all players draw ${count} card(s)`);
        break;
      }

      case "DRAW_BONUS_CARDS": {
        // Draw bonus cards and let player choose one to keep
        const drawCount = params.draw || 2;
        const drawnBonusCards = [];
        
        console.log(`[DRAW_BONUS_CARDS] Drawing ${drawCount} bonus cards for ${bird.name}`);
        
        for (let i = 0; i < drawCount; i++) {
          const bonusCard = game.bonusDeck.draw();
          if (bonusCard) {
            drawnBonusCards.push(bonusCard);
            console.log(`[DRAW_BONUS_CARDS] Drew bonus card: ${bonusCard.name || bonusCard.id}`);
          } else {
            console.log(`[DRAW_BONUS_CARDS] No more bonus cards in deck!`);
          }
        }
        
        if (drawnBonusCards.length > 0) {
          // Store the drawn cards in game state for player to choose from
          game.pendingBonusCardSelection = {
            playerId: player.id,
            cards: drawnBonusCards,
            birdName: bird.name
          };
          
          message = `⚡ ${bird.name} drew ${drawnBonusCards.length} bonus card(s) - choose one to keep!`;
          game.logs.push(`${player.name}'s ${bird.name} power: drew ${drawnBonusCards.length} bonus cards to choose from`);
          
          const activationResult = {
            playerId: player.id,
            playerName: player.name,
            birdName: bird.name,
            message: message,
            requiresBonusCardSelection: true,
            bonusCards: drawnBonusCards
          };
          
          console.log(`[DRAW_BONUS_CARDS] Returning activation result:`, JSON.stringify(activationResult, null, 2));
          
          // Return special indicator that client needs to show selection UI
          return activationResult;
        } else {
          message = `⚡ ${bird.name} tried to draw bonus cards, but none available!`;
          game.logs.push(`${player.name}'s ${bird.name} power: no bonus cards available`);
          console.log(`[DRAW_BONUS_CARDS] No bonus cards drawn!`);
        }
        break;
      }

      case "WHEN_OTHER_GAINS_FOOD":
      case "WHEN_OTHER_LAYS_EGGS":
      case "WHEN_OTHER_PLAYS_BIRD":
      case "WHEN_OTHER_PREDATOR_SUCCEEDS":
      case "BETWEEN_TURNS": {
        // These are between-turn powers, not activated on player's own turn
        // They should be handled by a different system
        message = `⚡ ${bird.name} has a between-turn power (triggers on other players' actions)`;
        game.logs.push(`${player.name}'s ${bird.name} power is active (between turns)`);
        break;
      }

      case "CUSTOM":
      case "UNKNOWN":
      default:
        // Unknown or custom power effect - log it but don't execute
        game.logs.push(`${player.name}'s ${bird.name} power activated (effect not implemented: ${bird.power.effect})`);
        break;
    }
    
    return message ? {
      playerId: player.id,
      playerName: player.name,
      birdName: bird.name,
      message: message
    } : null;
  }
}
