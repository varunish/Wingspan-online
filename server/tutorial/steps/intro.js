export const intro = {
  id: "INTRO",

  check(game, playerId) {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return null;

    if (game.logs.includes("Game started")) {
      return { complete: true };
    }

    return {
      message: "Welcome to Wingspan! You will take turns placing action cubes.",
      highlight: "ACTION_PANEL"
    };
  }
};
