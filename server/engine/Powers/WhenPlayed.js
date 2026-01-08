export class WhenPlayed {
  static execute({ bird, player, game }) {
    if (!bird.power) return;

    if (bird.power.effect === "GAIN_FOOD") {
      const food = bird.power.food;
      player.food[food] = (player.food[food] || 0) + 1;

      game.logs.push(
        `${player.name} gains 1 ${food} from ${bird.name} (when played)`
      );
    }
  }
}
