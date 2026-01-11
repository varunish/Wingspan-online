import { canPlayBird } from "../validators/canPlayBird.js";
import { PowerEngine } from "../Powers/PowerEngine.js";

export function PlayBird(game, player, birdId, habitat, wildFoodChoices = []) {
  const bird = player.hand.find(b => b.id === birdId);
  if (!bird) throw new Error("Bird not in hand");

  canPlayBird(game, player, bird, habitat, wildFoodChoices);

  // Pay food cost
  let wildChoiceIndex = 0;
  bird.foodCost.forEach(f => {
    // Handle OR costs (array of options, like ["seed", "fruit"] means seed OR fruit)
    if (Array.isArray(f)) {
      // This is an OR cost - deduct the first available option
      for (const option of f) {
        if (player.food[option] && player.food[option] > 0) {
          player.food[option]--;
          break;
        }
      }
    } else if (f === 'wild') {
      // Wild means ANY food type - use player's choice
      const chosenFood = wildFoodChoices[wildChoiceIndex++];
      if (!chosenFood || !player.food[chosenFood] || player.food[chosenFood] <= 0) {
        throw new Error(`Invalid wild food choice: ${chosenFood}`);
      }
      player.food[chosenFood]--;
    } else {
      // Specific food type (AND cost)
      player.food[f]--;
    }
  });

  // Pay egg cost
  // Normalize habitat name (wetland -> wetlands for consistency)
  const normalizedHabitat = habitat === 'wetland' ? 'wetlands' : habitat;
  const habitatBirds = player.habitats[normalizedHabitat];
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
  player.habitats[normalizedHabitat].push(placedBird);
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
