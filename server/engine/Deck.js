import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { shuffle } from "../utils/shuffle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Deck {
  constructor() {
    const file = path.join(__dirname, "../../data/birds.json");
    this.original = JSON.parse(fs.readFileSync(file, "utf-8"));
    this.cards = shuffle([...this.original]);
  }

  replenish() {
    // Refill from original to avoid undefined draws when deck runs dry
    this.cards = shuffle([...this.original]);
  }

  draw(count = 1) {
    if (count === 1) {
      if (!this.cards.length) this.replenish();
      const card = this.cards.pop();
      return card ? { ...card } : null;
    }
    const drawn = [];
    const seenIds = new Set();
    for (let i = 0; i < count; i++) {
      if (!this.cards.length) this.replenish();
      const card = this.cards.pop();
      if (card) {
        // Create a unique instance to avoid React key conflicts
        const cardCopy = { ...card };
        // Add instance ID if we've seen this bird ID before in this draw
        if (seenIds.has(card.id)) {
          cardCopy.instanceId = `${card.id}-${Date.now()}-${i}`;
        }
        seenIds.add(card.id);
        drawn.push(cardCopy);
      }
    }
    return drawn;
  }
}
