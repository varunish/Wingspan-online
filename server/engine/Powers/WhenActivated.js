export class WhenActivated {
  static execute({ bird, player, game }) {
    if (!bird.power || bird.power.type !== "WHEN_ACTIVATED") return;

    const effect = bird.power.effect;
    const value = bird.power.value || 1;

    switch (effect) {
      case "LAY_EGG":
        const capacity = bird.eggCapacity || 6;
        if (bird.eggs < capacity) {
          bird.eggs += value;
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
            game.logs.push(`${player.name} gains 1 ${food} from ${bird.name} (power activated)`);
          }
        } else {
          player.food[foodType] = (player.food[foodType] || 0) + value;
          game.logs.push(`${player.name} gains ${value} ${foodType} from ${bird.name} (power activated)`);
        }
        break;
      }

      case "DRAW_CARD": {
        const drawn = game.deck.draw(value);
        if (Array.isArray(drawn)) {
          player.hand.push(...drawn);
        } else if (drawn) {
          player.hand.push(drawn);
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
          game.logs.push(`${player.name} tucks a card under ${bird.name} (power activated)`);
        }
        break;
      }

      default:
        // Unknown power effect
        break;
    }
  }
}
