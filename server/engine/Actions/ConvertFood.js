// Food conversion: 2 food of any type → 1 food of any available type
// Available in the birdfeeder (not from supply)

export function ConvertFood(game, player, giveFoods, getFood) {
  // Validate: must give exactly 2 food
  if (!Array.isArray(giveFoods) || giveFoods.length !== 2) {
    throw new Error("Must convert exactly 2 food tokens");
  }

  // Validate: player has the food to give
  const foodCounts = { ...player.food };
  for (const food of giveFoods) {
    if ((foodCounts[food] || 0) < 1) {
      throw new Error(`Not enough ${food} to convert`);
    }
    foodCounts[food] -= 1;
  }

  // Validate: desired food is available in the birdfeeder
  const availableInFeeder = game.diceTray?.dice || [];
  if (!availableInFeeder.includes(getFood)) {
    throw new Error(`${getFood} is not available in the birdfeeder`);
  }

  // Execute conversion
  giveFoods.forEach(food => {
    player.food[food] = (player.food[food] || 0) - 1;
  });

  // Take the desired food from birdfeeder
  const takenFood = game.diceTray.take(getFood);
  player.food[takenFood] = (player.food[takenFood] || 0) + 1;

  game.logs.push(
    `${player.name} converted 2 food (${giveFoods.join(", ")}) for 1 ${takenFood}`
  );
}
