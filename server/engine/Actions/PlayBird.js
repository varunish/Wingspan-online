import { canPlayBird } from "../validators/canPlayBird.js";
import { PowerEngine } from "../Powers/PowerEngine.js";

export function PlayBird(game, player, birdId, habitat) {
  const bird = player.hand.find(b => b.id === birdId);
  if (!bird) throw new Error("Bird not in hand");

  canPlayBird(game, player, bird, habitat);

  // Pay food cost
  bird.foodCost.forEach(f => player.food[f]--);

  // Pay egg cost
  const habitatBirds = player.habitats[habitat];
  const columnIndex = habitatBirds.length;
  const eggCost = Math.min(columnIndex, 3);
  
  if (eggCost > 0) {
    let eggsToRemove = eggCost;
    const allBirds = [
      ...player.habitats.forest,
      ...player.habitats.grassland,
      ...player.habitats.wetlands
    ];
    
    for (const b of allBirds) {
      if (eggsToRemove === 0) break;
      const canRemove = Math.min(b.eggs || 0, eggsToRemove);
      b.eggs -= canRemove;
      eggsToRemove -= canRemove;
    }
  }

  const placedBird = { ...bird, eggs: 0 };
  player.habitats[habitat].push(placedBird);
  player.hand = player.hand.filter(b => b.id !== birdId);

  game.logs.push(`${player.name} played ${bird.name} in ${habitat}${eggCost > 0 ? ` (paid ${eggCost} eggs)` : ""}`);

  // 🔥 Power hook
  if (bird.power?.type === "WHEN_PLAYED") {
    PowerEngine.run("WHEN_PLAYED", {
      bird: placedBird,
      player,
      game
    });
  }
}
