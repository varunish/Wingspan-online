/**
 * Game Event System for tracking player actions and triggering between-turn powers
 */
export class GameEvents {
  constructor() {
    this.listeners = {
      PLAYER_GAINS_FOOD: [],
      PLAYER_LAYS_EGGS: [],
      PLAYER_DRAWS_CARDS: [],
      PLAYER_PLAYS_BIRD: [],
      PREDATOR_SUCCEEDS: [],
      PREDATOR_FAILS: [],
      ROUND_ENDS: [],
      GAME_ENDS: []
    };
  }

  /**
   * Register a listener for an event
   */
  on(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType].push(callback);
    }
  }

  /**
   * Remove a listener
   */
  off(eventType, callback) {
    if (this.listeners[eventType]) {
      this.listeners[eventType] = this.listeners[eventType].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit an event and execute all registered listeners
   */
  emit(eventType, data) {
    if (this.listeners[eventType]) {
      const results = [];
      for (const callback of this.listeners[eventType]) {
        try {
          const result = callback(data);
          if (result) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Error in event listener for ${eventType}:`, error);
        }
      }
      return results;
    }
    return [];
  }

  /**
   * Clear all listeners
   */
  clear() {
    Object.keys(this.listeners).forEach(key => {
      this.listeners[key] = [];
    });
  }

  /**
   * Register all between-turn powers for all players
   */
  registerBetweenTurnPowers(game) {
    // Clear existing listeners
    this.clear();

    // Register powers for each player
    game.players.forEach(player => {
      // Check all habitats for birds with between-turn powers
      ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
        const birds = player.habitats[habitat] || [];
        birds.forEach(bird => {
          if (bird && bird.power && bird.power.type === 'WHEN_ACTIVATED') {
            this.registerBirdPower(bird, player, game);
          }
        });
      });
    });
  }

  /**
   * Register a single bird's between-turn power
   */
  registerBirdPower(bird, ownerPlayer, game) {
    const powerText = bird.power.effect;
    if (!powerText || typeof powerText !== 'string') return;

    const text = powerText.toLowerCase();

    // Check if this is a between-turn power
    if (!text.includes('when another player')) return;

    // WHEN OTHER PLAYER GAINS FOOD
    if (text.includes('"gain food"')) {
      this.on('PLAYER_GAINS_FOOD', (data) => {
        // Don't trigger on own action
        if (data.playerId === ownerPlayer.id) return null;

        const result = this.handleWhenOtherGainsFood(bird, ownerPlayer, data, game);
        return result;
      });
    }

    // WHEN OTHER PLAYER LAYS EGGS
    if (text.includes('"lay eggs"')) {
      this.on('PLAYER_LAYS_EGGS', (data) => {
        // Don't trigger on own action
        if (data.playerId === ownerPlayer.id) return null;

        const result = this.handleWhenOtherLaysEggs(bird, ownerPlayer, data, game);
        return result;
      });
    }

    // WHEN OTHER PLAYER PLAYS BIRD
    if (text.includes('plays a') && text.includes('bird')) {
      this.on('PLAYER_PLAYS_BIRD', (data) => {
        // Don't trigger on own action
        if (data.playerId === ownerPlayer.id) return null;

        const result = this.handleWhenOtherPlaysBird(bird, ownerPlayer, data, game);
        return result;
      });
    }

    // WHEN OTHER PLAYER'S PREDATOR SUCCEEDS
    if (text.includes('predator succeeds')) {
      this.on('PREDATOR_SUCCEEDS', (data) => {
        // Don't trigger on own action
        if (data.playerId === ownerPlayer.id) return null;

        const result = this.handleWhenOtherPredatorSucceeds(bird, ownerPlayer, data, game);
        return result;
      });
    }
  }

  /**
   * Handle "When another player gains food" powers
   */
  handleWhenOtherGainsFood(bird, ownerPlayer, data, game) {
    const text = bird.power.effect.toLowerCase();

    // Check if specific food type is mentioned
    if (text.includes('rodent') || text.includes('[rodent]')) {
      // Check if the other player gained rodent
      if (data.foodTypes && data.foodTypes.includes('rodent')) {
        // This player gains 1 rodent and caches it
        if (text.includes('cache')) {
          bird.cachedFood = bird.cachedFood || [];
          bird.cachedFood.push('rodent');
          game.logs.push(`${ownerPlayer.name}'s ${bird.name} cached 1 rodent (between-turn power)`);
          return {
            playerId: ownerPlayer.id,
            playerName: ownerPlayer.name,
            birdName: bird.name,
            message: `⚡ ${ownerPlayer.name}'s ${bird.name} cached 1 rodent!`
          };
        } else {
          ownerPlayer.food.rodent = (ownerPlayer.food.rodent || 0) + 1;
          game.logs.push(`${ownerPlayer.name}'s ${bird.name} gained 1 rodent (between-turn power)`);
          return {
            playerId: ownerPlayer.id,
            playerName: ownerPlayer.name,
            birdName: bird.name,
            message: `⚡ ${ownerPlayer.name}'s ${bird.name} gained 1 rodent!`
          };
        }
      }
    }

    return null;
  }

  /**
   * Handle "When another player lays eggs" powers
   */
  handleWhenOtherLaysEggs(bird, ownerPlayer, data, game) {
    const text = bird.power.effect.toLowerCase();

    // Extract nest type from power text
    let targetNestType = null;
    if (text.includes('[ground]')) targetNestType = 'ground';
    else if (text.includes('[bowl]')) targetNestType = 'bowl';
    else if (text.includes('[cavity]')) targetNestType = 'cavity';
    else if (text.includes('[platform]')) targetNestType = 'platform';

    if (!targetNestType) return null;

    // Find a bird with the target nest type in owner's habitats
    let targetBird = null;
    for (const habitat of ['forest', 'grasslands', 'wetlands']) {
      const birds = ownerPlayer.habitats[habitat] || [];
      for (const b of birds) {
        if (b && b.nestType === targetNestType) {
          const capacity = b.eggCapacity || 6;
          if (b.eggs < capacity) {
            targetBird = b;
            break;
          }
        }
      }
      if (targetBird) break;
    }

    if (targetBird) {
      targetBird.eggs = (targetBird.eggs || 0) + 1;
      game.logs.push(`${ownerPlayer.name}'s ${bird.name} laid 1 egg on ${targetBird.name} (between-turn power)`);
      return {
        playerId: ownerPlayer.id,
        playerName: ownerPlayer.name,
        birdName: bird.name,
        message: `⚡ ${ownerPlayer.name}'s ${bird.name} laid 1 egg on ${targetBird.name}!`
      };
    }

    return null;
  }

  /**
   * Handle "When another player plays bird" powers
   */
  handleWhenOtherPlaysBird(bird, ownerPlayer, data, game) {
    const text = bird.power.effect.toLowerCase();

    // Extract habitat from power text
    let targetHabitat = null;
    if (text.includes('[forest]')) targetHabitat = 'forest';
    else if (text.includes('[grassland]')) targetHabitat = 'grasslands';
    else if (text.includes('[wetland]')) targetHabitat = 'wetlands';

    // Check if the played bird matches the habitat
    if (targetHabitat && data.habitat === targetHabitat) {
      // Gain food or tuck card based on power text
      if (text.includes('gain') && text.includes('invertebrate')) {
        ownerPlayer.food.invertebrate = (ownerPlayer.food.invertebrate || 0) + 1;
        game.logs.push(`${ownerPlayer.name}'s ${bird.name} gained 1 invertebrate (between-turn power)`);
        return {
          playerId: ownerPlayer.id,
          playerName: ownerPlayer.name,
          birdName: bird.name,
          message: `⚡ ${ownerPlayer.name}'s ${bird.name} gained 1 invertebrate!`
        };
      } else if (text.includes('gain') && text.includes('fish')) {
        ownerPlayer.food.fish = (ownerPlayer.food.fish || 0) + 1;
        game.logs.push(`${ownerPlayer.name}'s ${bird.name} gained 1 fish (between-turn power)`);
        return {
          playerId: ownerPlayer.id,
          playerName: ownerPlayer.name,
          birdName: bird.name,
          message: `⚡ ${ownerPlayer.name}'s ${bird.name} gained 1 fish!`
        };
      } else if (text.includes('tuck') && ownerPlayer.hand.length > 0) {
        const tuckedCard = ownerPlayer.hand.pop();
        bird.tuckedCards = bird.tuckedCards || [];
        bird.tuckedCards.push(tuckedCard);
        game.logs.push(`${ownerPlayer.name}'s ${bird.name} tucked a card (between-turn power)`);
        return {
          playerId: ownerPlayer.id,
          playerName: ownerPlayer.name,
          birdName: bird.name,
          message: `⚡ ${ownerPlayer.name}'s ${bird.name} tucked a card!`
        };
      }
    }

    return null;
  }

  /**
   * Handle "When another player's predator succeeds" powers
   */
  handleWhenOtherPredatorSucceeds(bird, ownerPlayer, data, game) {
    // Gain 1 food from the birdfeeder
    if (game.diceTray && game.diceTray.dice && game.diceTray.dice.length > 0) {
      const food = game.diceTray.take(game.diceTray.dice[0]);
      ownerPlayer.food[food] = (ownerPlayer.food[food] || 0) + 1;
      game.logs.push(`${ownerPlayer.name}'s ${bird.name} gained 1 ${food} from birdfeeder (between-turn power)`);
      return {
        playerId: ownerPlayer.id,
        playerName: ownerPlayer.name,
        birdName: bird.name,
        message: `⚡ ${ownerPlayer.name}'s ${bird.name} gained 1 ${food}!`
      };
    }

    return null;
  }
}
