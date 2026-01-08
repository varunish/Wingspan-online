export function canPlayBird(game, player, bird, habitat, wildFoodChoices = []) {
  if (game.turnManager.activePlayer !== player) {
    throw new Error("Not your turn");
  }

  if (!bird.habitats.includes(habitat)) {
    throw new Error("Invalid habitat");
  }

  // Check food cost
  // Create a copy of player's food to track what's been used
  const availableFood = { ...player.food };
  
  let wildChoiceIndex = 0;
  for (const requiredFood of bird.foodCost) {
    if (requiredFood === 'wild') {
      // Wild means ANY food type - validate player's choice
      const chosenFood = wildFoodChoices[wildChoiceIndex++];
      
      if (!chosenFood) {
        throw new Error("Must specify which food to use for wild cost");
      }
      
      if (!availableFood[chosenFood] || availableFood[chosenFood] <= 0) {
        throw new Error(`Insufficient ${chosenFood} for wild food choice`);
      }
      
      availableFood[chosenFood]--;
    } else {
      // Specific food type required
      if (!availableFood[requiredFood] || availableFood[requiredFood] <= 0) {
        throw new Error(`Insufficient food: need ${requiredFood}`);
      }
      availableFood[requiredFood]--;
    }
  }

  // Check egg cost based on column position
  const habitatBirds = player.habitats[habitat];
  const columnIndex = habitatBirds.length;
  
  // First column (index 0) = no egg cost
  // Second column (index 1) = 1 egg cost
  // Third column (index 2) = 2 egg cost
  // Fourth column (index 3) = 3 egg cost
  // Fifth column (index 4) = 3 egg cost
  const eggCost = Math.min(columnIndex, 3);
  
  if (eggCost > 0) {
    // Count total eggs available
    const totalEggs = [
      ...player.habitats.forest,
      ...player.habitats.grassland,
      ...player.habitats.wetlands
    ].reduce((sum, b) => sum + (b.eggs || 0), 0);
    
    if (totalEggs < eggCost) {
      throw new Error(`Not enough eggs: need ${eggCost}, have ${totalEggs}`);
    }
  }
}
