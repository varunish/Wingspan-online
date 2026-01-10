/**
 * Handles END_OF_ROUND powers - these trigger at the end of each round
 */
export class EndOfRound {
  static execute({ bird, player, game }) {
    if (!bird.power || bird.power.type !== "END_OF_ROUND") return null;

    const text = bird.power.effect.toLowerCase();
    let message = null;

    // Common END_OF_ROUND effects
    if (text.includes('draw') && text.includes('card')) {
      // Draw cards
      const match = text.match(/(\d+)/);
      const count = match ? parseInt(match[0]) : 1;
      
      const drawn = game.deck.draw(count);
      if (Array.isArray(drawn)) {
        player.hand.push(...drawn);
        message = `⚡ ${bird.name} drew ${drawn.length} card(s) at end of round!`;
      } else if (drawn) {
        player.hand.push(drawn);
        message = `⚡ ${bird.name} drew 1 card at end of round!`;
      }
      // Enforce hand limit
      if (player.hand.length > 8) {
        player.hand = player.hand.slice(0, 8);
      }
      game.logs.push(`${player.name} draws ${count} card(s) from ${bird.name} (end of round)`);
    } else if (text.includes('gain') && text.includes('food')) {
      // Gain food
      const foodType = this.extractFoodType(text);
      const match = text.match(/(\d+)/);
      const count = match ? parseInt(match[0]) : 1;
      
      if (foodType === 'wild' && game.diceTray && game.diceTray.dice && game.diceTray.dice.length > 0) {
        const food = game.diceTray.take(game.diceTray.dice[0]);
        player.food[food] = (player.food[food] || 0) + 1;
        message = `⚡ ${bird.name} gained 1 ${food} at end of round!`;
        game.logs.push(`${player.name} gains 1 ${food} from ${bird.name} (end of round)`);
      } else if (foodType !== 'wild') {
        player.food[foodType] = (player.food[foodType] || 0) + count;
        message = `⚡ ${bird.name} gained ${count} ${foodType} at end of round!`;
        game.logs.push(`${player.name} gains ${count} ${foodType} from ${bird.name} (end of round)`);
      }
    } else if (text.includes('discard') && text.includes('card')) {
      // Discard cards (negative effect)
      const match = text.match(/(\d+)/);
      const count = match ? parseInt(match[0]) : 1;
      const discarded = Math.min(count, player.hand.length);
      
      for (let i = 0; i < discarded; i++) {
        player.hand.pop();
      }
      
      if (discarded > 0) {
        message = `⚡ ${bird.name} discarded ${discarded} card(s) at end of round`;
        game.logs.push(`${player.name} discards ${discarded} card(s) from ${bird.name} (end of round)`);
      }
    } else if (text.includes('tuck') && text.includes('card')) {
      // Tuck cards
      if (player.hand.length > 0) {
        const match = text.match(/(\d+)/);
        const count = match ? parseInt(match[0]) : 1;
        const tuckedCount = Math.min(count, player.hand.length);
        bird.tuckedCards = bird.tuckedCards || [];
        
        for (let i = 0; i < tuckedCount; i++) {
          const card = player.hand.pop();
          bird.tuckedCards.push(card);
        }
        
        message = `⚡ ${bird.name} tucked ${tuckedCount} card(s) at end of round!`;
        game.logs.push(`${player.name} tucks ${tuckedCount} card(s) under ${bird.name} (end of round)`);
      }
    } else {
      // Generic end of round effect
      game.logs.push(`${player.name}'s ${bird.name} end-of-round power activated`);
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

  /**
   * Execute all END_OF_ROUND powers for all players
   */
  static executeAll(game) {
    const activations = [];
    
    game.players.forEach(player => {
      ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
        const birds = player.habitats[habitat] || [];
        birds.forEach(bird => {
          if (bird && bird.power && bird.power.type === 'END_OF_ROUND') {
            const activation = this.execute({ bird, player, game });
            if (activation) {
              activations.push(activation);
            }
          }
        });
      });
    });

    return activations;
  }
}
