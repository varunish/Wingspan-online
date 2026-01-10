import { canGainFood } from "../validators/canGainFood.js";
import { PowerEngine } from "../Powers/PowerEngine.js";

export function GainFood(game, player, habitat, foods) {
  canGainFood(game, player);

  const strength = player.habitats.forest.length + 1;
  if (foods.length !== strength) {
    throw new Error(`Must gain exactly ${strength} food`);
  }

  foods.forEach(f => {
    const gained = game.diceTray.take(f);
    player.food[gained] = (player.food[gained] || 0) + 1;
  });

  game.logs.push(`${player.name} gained ${foods.length} food from Forest`);

  // Activate bird powers in forest habitat (right to left)
  const powerActivations = [];
  const forestBirds = player.habitats.forest || [];
  for (let i = forestBirds.length - 1; i >= 0; i--) {
    const bird = forestBirds[i];
    if (bird.power?.type === "WHEN_ACTIVATED") {
      const activation = PowerEngine.run("WHEN_ACTIVATED", { bird, player, game });
      if (activation) {
        powerActivations.push(activation);
      }
    }
  }
  
  return powerActivations;
}
