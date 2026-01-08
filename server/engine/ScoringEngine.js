export class ScoringEngine {
  static scorePlayer(player) {
    let birdPoints = 0;
    let eggPoints = 0;
    let tuckedCardPoints = 0;
    let cachedFoodPoints = 0;

    const birds = [
      ...player.habitats.forest,
      ...player.habitats.grassland,
      ...player.habitats.wetlands
    ];

    birds.forEach(b => {
      birdPoints += b.points || 0;
      eggPoints += b.eggs || 0;
      // Tucked cards: 1 point each
      if (b.tuckedCards && b.tuckedCards.length > 0) {
        tuckedCardPoints += b.tuckedCards.length;
      }
      // Cached food: 1 point each
      if (b.cachedFood && b.cachedFood.length > 0) {
        cachedFoodPoints += b.cachedFood.length;
      }
    });

    let bonusPoints = 0;
    if (player.bonusCard?.id === "bonus-1") {
      bonusPoints += player.habitats.forest.length;
    }
    if (player.bonusCard?.id === "bonus-2") {
      bonusPoints += Math.floor(eggPoints / 2);
    }

    return {
      birdPoints,
      eggPoints,
      tuckedCardPoints,
      cachedFoodPoints,
      bonusPoints,
      roundGoalPoints: player.roundGoalPoints,
      total:
        birdPoints +
        eggPoints +
        tuckedCardPoints +
        cachedFoodPoints +
        bonusPoints +
        player.roundGoalPoints
    };
  }

  static scoreGame(players) {
    const scores = {};
    players.forEach(p => {
      scores[p.id] = {
        name: p.name,
        ...ScoringEngine.scorePlayer(p)
      };
    });
    return scores;
  }
}
