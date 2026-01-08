export class RoundGoalEngine {
  static score(goal, players, round) {
    // Calculate each player's performance on this round goal
    const playerScores = players.map(p => {
      let value = 0;
      switch (goal.id) {
        case "goal-1":
          value = p.habitats.forest.length;
          break;
        case "goal-2":
          value = RoundGoalEngine.countEggs(p);
          break;
        case "goal-3":
          value =
            p.habitats.forest.length +
            p.habitats.grassland.length +
            p.habitats.wetlands.length;
          break;
        case "goal-4":
          value = p.habitats.grassland.length;
          break;
        case "goal-5":
          value = p.habitats.wetlands.length;
          break;
        case "goal-6":
          value = p.hand.length;
          break;
        default:
          value = 0;
      }
      return { player: p, value };
    });

    // Sort by value descending
    playerScores.sort((a, b) => b.value - a.value);

    // Points vary by round
    const pointsTableByRound = {
      1: [5, 2, 1, 0],
      2: [6, 3, 2, 0],
      3: [7, 4, 2, 0],
      4: [8, 5, 3, 0]
    };

    const pointsTable = pointsTableByRound[round] || [5, 2, 1, 0];
    const positions = ["first", "second", "third", "fourth"];

    let currentRank = 0;
    let previousValue = null;

    playerScores.forEach((result, idx) => {
      // Handle ties: players with same score get same rank
      if (result.value !== previousValue) {
        currentRank = idx;
      }
      previousValue = result.value;

      const points = currentRank < pointsTable.length ? pointsTable[currentRank] : 0;
      const position = currentRank < positions.length ? positions[currentRank] : "fourth";

      // Add to player's total round goal points
      result.player.roundGoalPoints += points;

      // Track scoring history for the visual board
      if (!result.player.roundGoalScores) {
        result.player.roundGoalScores = [];
      }
      result.player.roundGoalScores.push({
        round: round,
        position: position,
        points: points,
        score: result.value
      });
    });

    // Return ranked player IDs for logging
    return playerScores.map(ps => ps.player.id);
  }

  static countEggs(player) {
    return [
      ...player.habitats.forest,
      ...player.habitats.grassland,
      ...player.habitats.wetlands
    ].reduce((sum, b) => sum + (b.eggs || 0), 0);
  }
}
