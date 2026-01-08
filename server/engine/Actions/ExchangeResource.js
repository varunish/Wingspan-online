// Exchange actions for habitat column bonuses
// Based on official Wingspan player mat exchanges

export function ExchangeResource(game, player, exchangeType, params = {}) {
  switch (exchangeType) {
    case "egg_for_food": {
      // Forest columns 3 & 5: Exchange 1 egg for 2 food from supply
      if (player.eggs < 1) {
        throw new Error("Not enough eggs for exchange");
      }

      // Take egg from any bird
      const allBirds = [
        ...player.habitats.forest,
        ...player.habitats.grassland,
        ...player.habitats.wetlands
      ];

      const birdWithEgg = allBirds.find(b => b.eggs > 0);
      if (!birdWithEgg) {
        throw new Error("No bird has eggs to exchange");
      }

      birdWithEgg.eggs -= 1;

      // Give 2 food of any type from supply
      const foodType1 = params.foodType1 || "seed";
      const foodType2 = params.foodType2 || "seed";

      player.food[foodType1] = (player.food[foodType1] || 0) + 1;
      player.food[foodType2] = (player.food[foodType2] || 0) + 1;

      game.logs.push(
        `${player.name} exchanged 1 egg for 2 food from supply`
      );
      break;
    }

    case "extra_egg": {
      // Grassland columns 3 & 5: Lay 1 additional egg on any bird
      const birdId = params.birdId;
      if (!birdId) {
        throw new Error("No bird selected for extra egg");
      }

      const allBirds = [
        ...player.habitats.forest,
        ...player.habitats.grassland,
        ...player.habitats.wetlands
      ];

      const bird = allBirds.find(b => b.id === birdId);
      if (!bird) {
        throw new Error("Bird not found");
      }

      const capacity = bird.eggCapacity || 6;
      if (bird.eggs >= capacity) {
        throw new Error(`${bird.name} is at egg capacity`);
      }

      bird.eggs += 1;
      game.logs.push(`${player.name} laid 1 bonus egg on ${bird.name}`);
      break;
    }

    case "food_for_card": {
      // Wetlands column 3: Pay 1 food to draw 1 card
      const foodType = params.foodType || "invertebrate";
      if ((player.food[foodType] || 0) < 1) {
        throw new Error(`Not enough ${foodType} to exchange`);
      }

      player.food[foodType] -= 1;

      const card = game.deck.draw(1);
      if (card) {
        if (Array.isArray(card)) {
          player.hand.push(...card);
        } else {
          player.hand.push(card);
        }

        // Enforce hand limit
        if (player.hand.length > 8) {
          player.hand = player.hand.slice(0, 8);
        }

        game.logs.push(`${player.name} exchanged 1 ${foodType} for 1 card`);
      }
      break;
    }

    case "food_for_tuck": {
      // Wetlands column 5: Pay 1 food to tuck a card
      const foodType = params.foodType || "invertebrate";
      const birdId = params.birdId;

      if ((player.food[foodType] || 0) < 1) {
        throw new Error(`Not enough ${foodType} to exchange`);
      }

      if (!birdId) {
        throw new Error("No bird selected to tuck card");
      }

      if (player.hand.length === 0) {
        throw new Error("No cards in hand to tuck");
      }

      const allBirds = [
        ...player.habitats.forest,
        ...player.habitats.grassland,
        ...player.habitats.wetlands
      ];

      const bird = allBirds.find(b => b.id === birdId);
      if (!bird) {
        throw new Error("Bird not found");
      }

      player.food[foodType] -= 1;

      const cardToTuck = player.hand.pop();
      bird.tuckedCards = bird.tuckedCards || [];
      bird.tuckedCards.push(cardToTuck);

      game.logs.push(
        `${player.name} tucked ${cardToTuck.name} under ${bird.name} (paid 1 ${foodType})`
      );
      break;
    }

    default:
      throw new Error(`Unknown exchange type: ${exchangeType}`);
  }
}
