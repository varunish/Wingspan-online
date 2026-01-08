export function canLayEggs(game, player, habitat, birdIds) {
  if (game.turnManager.activePlayer !== player) {
    throw new Error("Not your turn");
  }

  if (habitat !== "grassland") {
    throw new Error("Must use Grassland");
  }

  const strength = player.habitats.grassland.length + 1;
  if (birdIds.length !== strength) {
    throw new Error(`Must lay exactly ${strength} eggs`);
  }

  // Validate egg capacity for each bird
  const allBirds = [
    ...player.habitats.forest,
    ...player.habitats.grassland,
    ...player.habitats.wetlands
  ];

  birdIds.forEach(birdId => {
    const bird = allBirds.find(b => b.id === birdId);
    if (!bird) throw new Error("Bird not found");
    
    const capacity = bird.eggCapacity || 6; // Default capacity if not specified
    if (bird.eggs >= capacity) {
      throw new Error(`${bird.name} is at egg capacity (${capacity})`);
    }
  });
}
