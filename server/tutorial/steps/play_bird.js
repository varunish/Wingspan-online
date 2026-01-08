export const playBird = {
  id: "PLAY_BIRD",

  check(game, playerId) {
    const player = game.players.find(p => p.id === playerId);
    if (!player) return null;

    const hasBird = Object.values(player.habitats)
      .flat()
      .length > 0;

    if (hasBird) {
      return { complete: true };
    }

    if (!player.hand.length) {
      return {
        message: "Draw bird cards to play birds later.",
        highlight: "CARD_DECK"
      };
    }

    return {
      message: "Play a bird from your hand into a valid habitat.",
      highlight: "HAND"
    };
  }
};
