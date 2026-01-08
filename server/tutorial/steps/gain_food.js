export const gainFood = {
  id: "GAIN_FOOD",

  check(game, playerId) {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return null;

    const gained = game.logs.some(
      l => l.startsWith(player.name) && l.includes("gained 1 food")
    );

    if (gained) {
      return { complete: true };
    }

    return {
      message: "Start by gaining food from the Forest habitat.",
      highlight: "FOREST_ROW"
    };
  }
};
