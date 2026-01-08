export class EndOfRound {
  static execute({ bird, player, game }) {
    if (!bird.power) return;

    if (bird.power.effect === "END_ROUND_EGG") {
      bird.eggs += 1;
      game.logs.push(
        `${player.name} gains 1 egg from ${bird.name} (end of round)`
      );
    }
  }
}
