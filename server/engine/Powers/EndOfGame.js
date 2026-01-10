/**
 * Handles END_OF_GAME powers - these trigger during final scoring
 * Most are scoring bonuses that add points based on conditions
 */
export class EndOfGame {
  static execute({ bird, player, game }) {
    if (!bird.power || bird.power.type !== "END_OF_GAME") return null;

    const text = bird.power.effect.toLowerCase();
    let bonusPoints = 0;
    let message = null;

    // Score points based on various conditions
    if (text.includes('point') || text.includes('pt')) {
      // Extract point value per condition
      const pointMatch = text.match(/(\d+)\s*(?:point|pt)/);
      const pointsPerMatch = pointMatch ? parseInt(pointMatch[0]) : 1;

      // Count tucked cards
      if (text.includes('tuck') || text.includes('behind this bird')) {
        const tuckedCount = bird.tuckedCards ? bird.tuckedCards.length : 0;
        bonusPoints = tuckedCount * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${tuckedCount} tucked card(s)!`;
      }
      // Count eggs on this bird
      else if (text.includes('egg') && text.includes('this bird')) {
        const eggCount = bird.eggs || 0;
        bonusPoints = eggCount * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${eggCount} egg(s)!`;
      }
      // Count cached food
      else if (text.includes('cache') || text.includes('food on this bird')) {
        const cachedCount = bird.cachedFood ? bird.cachedFood.length : 0;
        bonusPoints = cachedCount * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${cachedCount} cached food!`;
      }
      // Count sets of food
      else if (text.includes('set') && text.includes('food')) {
        const foodCounts = Object.values(player.food);
        const minFood = Math.min(...foodCounts);
        bonusPoints = minFood * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${minFood} food set(s)!`;
      }
      // Count specific bird types
      else if (text.includes('bird')) {
        let birdCount = 0;
        
        // Count by habitat
        if (text.includes('forest')) {
          birdCount = (player.habitats.forest || []).filter(b => b).length;
        } else if (text.includes('grassland')) {
          birdCount = (player.habitats.grasslands || []).filter(b => b).length;
        } else if (text.includes('wetland')) {
          birdCount = (player.habitats.wetlands || []).filter(b => b).length;
        }
        // Count by nest type
        else if (text.includes('bowl nest')) {
          ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
            birdCount += (player.habitats[habitat] || []).filter(b => b && b.nestType === 'bowl').length;
          });
        } else if (text.includes('cavity nest')) {
          ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
            birdCount += (player.habitats[habitat] || []).filter(b => b && b.nestType === 'cavity').length;
          });
        } else if (text.includes('platform nest')) {
          ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
            birdCount += (player.habitats[habitat] || []).filter(b => b && b.nestType === 'platform').length;
          });
        } else if (text.includes('ground nest')) {
          ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
            birdCount += (player.habitats[habitat] || []).filter(b => b && b.nestType === 'ground').length;
          });
        }
        // Count by food type
        else if (text.includes('no egg')) {
          ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
            birdCount += (player.habitats[habitat] || []).filter(b => b && b.eggs === 0).length;
          });
        }

        bonusPoints = birdCount * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${birdCount} matching bird(s)!`;
      }
      // Count eggs in habitat
      else if (text.includes('egg') && (text.includes('forest') || text.includes('grassland') || text.includes('wetland'))) {
        let habitat = 'forest';
        if (text.includes('grassland')) habitat = 'grasslands';
        if (text.includes('wetland')) habitat = 'wetlands';
        
        let eggCount = 0;
        (player.habitats[habitat] || []).forEach(b => {
          if (b) eggCount += (b.eggs || 0);
        });
        
        bonusPoints = eggCount * pointsPerMatch;
        message = `⚡ ${bird.name} scored ${bonusPoints} points from ${eggCount} egg(s) in ${habitat}!`;
      }

      // Award points
      if (bonusPoints > 0) {
        player.bonusPoints = (player.bonusPoints || 0) + bonusPoints;
        game.logs.push(`${player.name}'s ${bird.name} scored ${bonusPoints} bonus points (end of game)`);
      }
    }

    return message ? {
      playerId: player.id,
      playerName: player.name,
      birdName: bird.name,
      message: message,
      points: bonusPoints
    } : null;
  }

  /**
   * Execute all END_OF_GAME powers for all players
   */
  static executeAll(game) {
    const activations = [];
    
    game.players.forEach(player => {
      ['forest', 'grasslands', 'wetlands'].forEach(habitat => {
        const birds = player.habitats[habitat] || [];
        birds.forEach(bird => {
          if (bird && bird.power && bird.power.type === 'END_OF_GAME') {
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
