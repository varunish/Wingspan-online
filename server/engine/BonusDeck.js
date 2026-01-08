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
    this.cards = shuffle(data);
  }

  draw() {
    return this.cards.pop();
  }
}
