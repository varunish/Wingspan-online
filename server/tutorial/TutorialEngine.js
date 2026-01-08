import { intro } from "./steps/intro.js";
import { gainFood } from "./steps/gain_food.js";
import { playBird } from "./steps/play_bird.js";

const STEPS = [intro, gainFood, playBird];

export class TutorialEngine {
  constructor() {
    this.enabled = true;
    this.stepIndexByPlayer = new Map();
  }

  getHint(playerId, game) {
    if (!this.enabled) return null;

    const idx = this.stepIndexByPlayer.get(playerId) ?? 0;
    const step = STEPS[idx];
    if (!step) return null;

    const result = step.check(game, playerId);
    if (!result) return null;

    if (result.complete) {
      this.stepIndexByPlayer.set(playerId, idx + 1);
      return null;
    }

    return {
      step: step.id,
      message: result.message,
      highlight: result.highlight || null
    };
  }
}
