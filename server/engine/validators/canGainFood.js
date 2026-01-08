export function canGainFood(game, player) {
  if (game.turnManager.activePlayer !== player) {
    throw new Error("Not your turn");
  }
}
