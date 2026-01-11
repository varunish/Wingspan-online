import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { shuffle } from "../utils/shuffle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class BonusDeck {
  constructor() {
    const file = path.join(__dirname, "../../data/bonus_cards.json");
    const data = JSON.parse(fs.readFileSync(file, "utf-8"));
    
    // Create multiple copies of each bonus card to allow duplicates between players
    // In a 5-player game, each player gets 2 bonus cards, so we need at least 10 cards
    // We'll create 5 copies of each card to ensure enough for up to 12 players
    const expandedDeck = [];
    for (let i = 0; i < 5; i++) {
      data.forEach(card => {
        expandedDeck.push({ ...card, instanceId: `${card.id}-copy-${i}` });
      });
    }
    
    this.cards = shuffle(expandedDeck);
  }

  draw() {
    return this.cards.pop();
  }

  // Return a card to the deck and reshuffle
  returnCard(card) {
    if (card) {
      this.cards.push(card);
      this.cards = shuffle(this.cards);
    }
  }
}
