import { PowerParser } from "./PowerParser.js";

/**
 * Handles WHEN_PLAYED powers - these trigger once when a bird is played
 */
export class WhenPlayed {
  static execute({ bird, player, game }) {
    if (!bird.power || bird.power.type !== "WHEN_PLAYED") return null;

    const parsed = PowerParser.parse(bird.power);
    const effectType = parsed.effectType;
    const params = parsed.params;
    const text = bird.power.effect.toLowerCase();

    let message = null;

    // Common WHEN_PLAYED effects
    if (text.includes('draw') && text.includes('card')) {
      const count = params.count || 1;
      const drawn = game.deck.draw(count);
      if (Array.isArray(drawn)) {
        player.hand.push(...drawn);
        message = `⚡ ${bird.name} drew ${drawn.length} card(s) when played!`;
      } else if (drawn) {
        player.hand.push(drawn);
        message = `⚡ ${bird.name} drew 1 card when played!`;
      }
      // Enforce hand limit
      if (player.hand.length > 8) {
        player.hand = player.hand.slice(0, 8);
      }
      game.logs.push(`${player.name} draws ${count} card(s) from ${bird.name} (when played)`);
    } else if (text.includes('gain') && text.includes('food')) {
      // Gain food when played
      const foodType = this.extractFoodType(text);
      const count = params.count || 1;
      
      if (foodType === 'wild' && game.diceTray && game.diceTray.dice && game.diceTray.dice.length > 0) {
        const food = game.diceTray.take(game.diceTray.dice[0]);
        player.food[food] = (player.food[food] || 0) + 1;
        message = `⚡ ${bird.name} gained 1 ${food} when played!`;
        game.logs.push(`${player.name} gains 1 ${food} from ${bird.name} (when played)`);
      } else if (foodType !== 'wild') {
        player.food[foodType] = (player.food[foodType] || 0) + count;
        message = `⚡ ${bird.name} gained ${count} ${foodType} when played!`;
        game.logs.push(`${player.name} gains ${count} ${foodType} from ${bird.name} (when played)`);
      }
    } else if (text.includes('lay') && text.includes('egg')) {
      // Lay eggs when played
      const count = params.count || 1;
      const capacity = bird.eggCapacity || 6;
      const eggsToLay = Math.min(count, capacity - (bird.eggs || 0));
      
      if (eggsToLay > 0) {
        bird.eggs = (bird.eggs || 0) + eggsToLay;
        message = `⚡ ${bird.name} laid ${eggsToLay} egg(s) when played!`;
        game.logs.push(`${player.name} lays ${eggsToLay} egg(s) on ${bird.name} (when played)`);
      }
    } else if (text.includes('tuck') && text.includes('card')) {
      // Tuck cards when played
      if (player.hand.length > 0) {
        const count = params.count || 1;
        const tuckedCount = Math.min(count, player.hand.length);
        bird.tuckedCards = bird.tuckedCards || [];
        
        for (let i = 0; i < tuckedCount; i++) {
          const card = player.hand.pop();
          bird.tuckedCards.push(card);
        }
        
        message = `⚡ ${bird.name} tucked ${tuckedCount} card(s) when played!`;
        game.logs.push(`${player.name} tucks ${tuckedCount} card(s) under ${bird.name} (when played)`);
      }
    } else {
      // Generic when played effect
      game.logs.push(`${player.name} played ${bird.name} (power: ${bird.power.effect})`);
    }

    return message ? {
      playerId: player.id,
      playerName: player.name,
      birdName: bird.name,
      message: message
    } : null;
  }

  static extractFoodType(text) {
    if (text.includes('[invertebrate]') || text.includes('invertebrate')) return 'invertebrate';
    if (text.includes('[seed]') || text.includes('seed')) return 'seed';
    if (text.includes('[fish]') || text.includes('fish')) return 'fish';
    if (text.includes('[fruit]') || text.includes('fruit')) return 'fruit';
    if (text.includes('[rodent]') || text.includes('rodent')) return 'rodent';
    return 'wild';
  }
}
