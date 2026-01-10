import { WhenPlayed } from "./WhenPlayed.js";
import { WhenActivated } from "./WhenActivated.js";
import { EndOfRound } from "./EndOfRound.js";
import { EndOfGame } from "./EndOfGame.js";

export class PowerEngine {
  static run(type, context) {
    switch (type) {
      case "WHEN_PLAYED":
        return WhenPlayed.execute(context);
      case "WHEN_ACTIVATED":
        return WhenActivated.execute(context);
      case "END_OF_ROUND":
        return EndOfRound.execute(context);
      case "END_OF_GAME":
        return EndOfGame.execute(context);
      default:
        return null;
    }
  }
}
