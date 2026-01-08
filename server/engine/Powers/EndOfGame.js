export class EndOfGame {
  static execute({ bird, player, game }) {
    if (!bird.power) return;

    if (bird.power.effect === "END_GAME_POINTS") {
      player.roundGoalPoints += bird.power.points;
      game.logs.push(
        `${player.name} gains ${bird.power.points} points from ${bird.name} (end of game)`
      );
    }
  }
}
