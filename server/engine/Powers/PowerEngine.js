import { WhenPlayed } from "./WhenPlayed.js";
import { WhenActivated } from "./WhenActivated.js";
import { EndOfRound } from "./EndOfRound.js";
import { EndOfGame } from "./EndOfGame.js";

export class PowerEngine {
  static run(type, context) {
    switch (type) {
      case "WHEN_PLAYED":
        WhenPlayed.execute(context);
        break;
      case "WHEN_ACTIVATED":
        WhenActivated.execute(context);
        break;
      case "END_OF_ROUND":
        EndOfRound.execute(context);
        break;
      case "END_OF_GAME":
        EndOfGame.execute(context);
        break;
      default:
        break;
    }
  }
}
