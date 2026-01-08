import { canLayEggs } from "../validators/canLayEggs.js";
import { PowerEngine } from "../Powers/PowerEngine.js";

export function LayEggs(game, player, habitat, birdIds) {
  canLayEggs(game, player, habitat, birdIds);

  birdIds.forEach(id => {
    const bird =
      player.habitats.forest.find(b => b.id === id) ||
      player.habitats.grassland.find(b => b.id === id) ||
      player.habitats.wetlands.find(b => b.id === id);

    if (!bird) throw new Error("Invalid bird");
    bird.eggs++;
  });

  game.logs.push(`${player.name} laid ${birdIds.length} eggs`);

  // Activate bird powers in grassland habitat (right to left)
  const grasslandBirds = player.habitats.grassland || [];
  for (let i = grasslandBirds.length - 1; i >= 0; i--) {
    const bird = grasslandBirds[i];
    if (bird.power?.type === "WHEN_ACTIVATED") {
      PowerEngine.run("WHEN_ACTIVATED", { bird, player, game });
    }
  }
}
