export function canDrawCards(game, player, habitat, count) {
  if (game.turnManager.activePlayer !== player) {
    throw new Error("Not your turn");
  }

  if (habitat !== "wetlands") {
    throw new Error("Must use Wetlands");
  }

  const strength = player.habitats.wetlands.length + 1;
  if (count !== strength) {
    throw new Error(`Must draw exactly ${strength} cards`);
  }
}
