import { Deck } from "./Deck.js";
import { BonusDeck } from "./BonusDeck.js";
import { DiceTray } from "./DiceTray.js";
import { Player } from "./Player.js";
import { TurnManager } from "./TurnManager.js";
import { RoundGoalEngine } from "./RoundGoalEngine.js";
import { uid } from "../utils/uid.js";
import { shuffle } from "../utils/shuffle.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Game {
  constructor() {
    this.id = uid();
    this.players = [];
    this.phase = "SETUP"; // SETUP | PLAY | END

    this.round = { round: 1, maxRounds: 4 };
    this.roundConfig = [8, 7, 6, 5];

    this.deck = new Deck();
    this.bonusDeck = new BonusDeck();
    this.diceTray = new DiceTray();
    this.turnManager = new TurnManager();

    // Select 4 random round goals for the game
    const goalsFile = path.join(__dirname, "../../data/round_goals.json");
    const allGoals = JSON.parse(fs.readFileSync(goalsFile, "utf-8"));
    this.roundGoals = shuffle(allGoals).slice(0, 4);

    // Face-up bird tray (3 visible cards)
    this.birdTray = [
      this.deck.draw(),
      this.deck.draw(),
      this.deck.draw()
    ].filter(b => b);

    this.logs = [];
  }

  addPlayer(name, socketId) {
    this.players.push(new Player(name, socketId));
  }

  getPlayer(socketId) {
    return this.players.find(p => p.id === socketId);
  }

  dealSetup() {
    for (const p of this.players) {
      // Draw 5 birds per player for setup
      p.setup.birds = this.deck.draw(5);
      
      // Draw 2 bonus cards per player
      const bonus1 = this.bonusDeck.draw();
      const bonus2 = this.bonusDeck.draw();
      p.setup.bonusCards = [bonus1, bonus2].filter(b => b !== null && b !== undefined);
      
      p.food = {
        fish: 1,
        seed: 1,
        fruit: 1,
        rodent: 1,
        invertebrate: 1
      };
    }
  }

  startRound() {
    const cubes = this.roundConfig[this.round.round - 1];
    this.players.forEach(p => (p.actionCubes = cubes));
    this.turnManager.reset(this.players);
    this.logs.push(`Round ${this.round.round} started`);
  }

  endRound() {
    const currentGoal = this.roundGoals[this.round.round - 1];
    if (currentGoal) {
      const scores = RoundGoalEngine.score(currentGoal, this.players, this.round.round);
      this.logs.push(`Round ${this.round.round} goal: ${currentGoal.name}`);
      
      // Award points based on ranking
      scores.forEach((playerId, rank) => {
        const player = this.players.find(p => p.id === playerId);
        const points = [4, 3, 2, 1][rank] || 0;
        player.roundGoalPoints += points;
        this.logs.push(`${player.name} scored ${points} points for round goal`);
      });
    }
  }

  refillBirdTray() {
    while (this.birdTray.length < 3) {
      const card = this.deck.draw();
      if (card) this.birdTray.push(card);
      else break; // Deck empty
    }
  }

  serialize() {
    return {
      id: this.id,
      phase: this.phase,
      round: this.round,
      players: this.players,
      turn: this.turnManager.serialize(),
      diceTray: this.diceTray.dice, // Send as array directly
      birdTray: this.birdTray,
      faceUpBirds: this.birdTray, // Alias for compatibility
      roundGoals: this.roundGoals,
      currentRoundGoal: this.roundGoals[this.round.round - 1],
      logs: this.logs
    };
  }
}
