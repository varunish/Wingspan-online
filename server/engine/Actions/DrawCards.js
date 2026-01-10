import { canDrawCards } from "../validators/canDrawCards.js";
import { PowerEngine } from "../Powers/PowerEngine.js";

export function DrawCards(game, player, habitat, count, fromTray = []) {
  canDrawCards(game, player, habitat, count);

  let actualDrawn = 0;

  // Draw from tray first (if player selected any)
  if (Array.isArray(fromTray) && fromTray.length > 0) {
    fromTray.forEach(birdId => {
      // Find bird in tray by ID or instanceId
      const idx = game.birdTray.findIndex(b => 
        b && (b.id === birdId || b.instanceId === birdId)
      );
      if (idx !== -1) {
        const bird = game.birdTray[idx];
        player.hand.push(bird);
        game.birdTray.splice(idx, 1);
        actualDrawn++;
        game.logs.push(`${player.name} drew ${bird.name} from face-up tray`);
      }
    });
  }

  // Draw remaining from deck
  const remaining = count - actualDrawn;
  if (remaining > 0) {
    const drawn = game.deck.draw(remaining);
    if (Array.isArray(drawn)) {
      player.hand.push(...drawn);
      actualDrawn += drawn.length;
    } else if (drawn) {
      player.hand.push(drawn);
      actualDrawn++;
    }
  }

  // Refill tray
  game.refillBirdTray();

  // Enforce hand limit of 8
  if (player.hand.length > 8) {
    const excess = player.hand.length - 8;
    game.logs.push(`${player.name} exceeded hand limit, discarding ${excess} cards`);
    player.hand = player.hand.slice(0, 8);
  }

  game.logs.push(`${player.name} drew ${actualDrawn} cards`);

  // Activate bird powers in wetlands habitat (right to left)
  const powerActivations = [];
  const wetlandBirds = player.habitats.wetlands || [];
  for (let i = wetlandBirds.length - 1; i >= 0; i--) {
    const bird = wetlandBirds[i];
    if (bird.power?.type === "WHEN_ACTIVATED") {
      const activation = PowerEngine.run("WHEN_ACTIVATED", { bird, player, game });
      if (activation) {
        powerActivations.push(activation);
      }
    }
  }
  
  return powerActivations;
}
