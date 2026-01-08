// Client-side validation helpers with detailed error messages

export function validateGainFood(player, state) {
  if (!player) return { valid: false, error: "Player not found" };
  
  const isMyTurn = state.turn?.activePlayerId === player.id;
  if (!isMyTurn) {
    const activePlayer = state.players.find(p => p.id === state.turn?.activePlayerId);
    return { 
      valid: false, 
      error: `Not your turn. Waiting for ${activePlayer?.name || "another player"} to play.` 
    };
  }

  if (player.actionCubes <= 0) {
    return { 
      valid: false, 
      error: "No action cubes remaining. Wait for the next round." 
    };
  }

  const forestStrength = (player.habitats?.forest?.length || 0) + 1;
  const availableFood = (state.diceTray || []).length;
  
  if (availableFood < forestStrength) {
    return {
      valid: false,
      error: `Not enough food dice available. You need ${forestStrength} food but only ${availableFood} dice are showing.`
    };
  }

  return { valid: true };
}

export function validatePlayBird(player, state, birdId, habitat) {
  if (!player) return { valid: false, error: "Player not found" };
  
  const isMyTurn = state.turn?.activePlayerId === player.id;
  if (!isMyTurn) {
    const activePlayer = state.players.find(p => p.id === state.turn?.activePlayerId);
    return { 
      valid: false, 
      error: `Not your turn. Waiting for ${activePlayer?.name || "another player"} to play.` 
    };
  }

  if (player.actionCubes <= 0) {
    return { 
      valid: false, 
      error: "No action cubes remaining. Wait for the next round." 
    };
  }

  const bird = player.hand?.find(b => b.id === birdId);
  if (!bird) {
    return { valid: false, error: "Bird not found in your hand" };
  }

  if (!bird.habitats?.includes(habitat)) {
    return { 
      valid: false, 
      error: `${bird.name} cannot be played in ${habitat}. Valid habitats: ${bird.habitats.join(", ")}` 
    };
  }

  // Check food cost
  const foodCost = bird.foodCost || [];
  const playerFood = player.food || {};
  const missingFood = [];
  
  foodCost.forEach(foodType => {
    if (!playerFood[foodType] || playerFood[foodType] <= 0) {
      missingFood.push(foodType);
    }
  });

  if (missingFood.length > 0) {
    return { 
      valid: false, 
      error: `Insufficient food to play ${bird.name}. Missing: ${missingFood.join(", ")}. Required: ${foodCost.join(", ")}` 
    };
  }

  // Check egg cost
  const habitatBirds = player.habitats?.[habitat] || [];
  const columnIndex = habitatBirds.length;
  const eggCost = Math.min(columnIndex, 3);
  
  if (eggCost > 0) {
    const totalEggs = [
      ...(player.habitats?.forest || []),
      ...(player.habitats?.grassland || []),
      ...(player.habitats?.wetlands || [])
    ].reduce((sum, b) => sum + (b.eggs || 0), 0);
    
    if (totalEggs < eggCost) {
      return { 
        valid: false, 
        error: `Not enough eggs to play bird in column ${columnIndex + 1}. Need ${eggCost} eggs, but you only have ${totalEggs}.` 
      };
    }
  }

  // Check if habitat is full
  if (habitatBirds.length >= 5) {
    return {
      valid: false,
      error: `${habitat} habitat is full (5/5 birds). You cannot place more birds here.`
    };
  }

  return { valid: true };
}

export function validateLayEggs(player, state, birdIds) {
  if (!player) return { valid: false, error: "Player not found" };
  
  const isMyTurn = state.turn?.activePlayerId === player.id;
  if (!isMyTurn) {
    const activePlayer = state.players.find(p => p.id === state.turn?.activePlayerId);
    return { 
      valid: false, 
      error: `Not your turn. Waiting for ${activePlayer?.name || "another player"} to play.` 
    };
  }

  if (player.actionCubes <= 0) {
    return { 
      valid: false, 
      error: "No action cubes remaining. Wait for the next round." 
    };
  }

  const grassStrength = (player.habitats?.grassland?.length || 0) + 1;
  
  if (birdIds.length !== grassStrength) {
    return { 
      valid: false, 
      error: `Must lay exactly ${grassStrength} eggs (based on your grassland strength). You selected ${birdIds.length}.` 
    };
  }

  const allBirds = [
    ...(player.habitats?.forest || []),
    ...(player.habitats?.grassland || []),
    ...(player.habitats?.wetlands || [])
  ];

  for (const birdId of birdIds) {
    const bird = allBirds.find(b => b.id === birdId);
    if (!bird) {
      return { valid: false, error: "One or more selected birds not found" };
    }
    
    const capacity = bird.eggCapacity || 6;
    if (bird.eggs >= capacity) {
      return { 
        valid: false, 
        error: `${bird.name} is at full egg capacity (${capacity}/${capacity}). Choose a different bird.` 
      };
    }
  }

  return { valid: true };
}

export function validateDrawCards(player, state, count) {
  if (!player) return { valid: false, error: "Player not found" };
  
  const isMyTurn = state.turn?.activePlayerId === player.id;
  if (!isMyTurn) {
    const activePlayer = state.players.find(p => p.id === state.turn?.activePlayerId);
    return { 
      valid: false, 
      error: `Not your turn. Waiting for ${activePlayer?.name || "another player"} to play.` 
    };
  }

  if (player.actionCubes <= 0) {
    return { 
      valid: false, 
      error: "No action cubes remaining. Wait for the next round." 
    };
  }

  const wetlandStrength = (player.habitats?.wetlands?.length || 0) + 1;
  
  if (count !== wetlandStrength) {
    return { 
      valid: false, 
      error: `Must draw exactly ${wetlandStrength} cards (based on your wetlands strength). You tried to draw ${count}.` 
    };
  }

  const currentHandSize = player.hand?.length || 0;
  if (currentHandSize + count > 8) {
    return {
      valid: true,
      warning: `Drawing ${count} cards will exceed hand limit of 8. Extra cards will be auto-discarded.`
    };
  }

  return { valid: true };
}
