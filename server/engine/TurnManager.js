export class TurnManager {
  constructor(players) {
    this.players = players || [];
    this.activeIndex = 0;
  }

  get activePlayer() {
    if (!this.players.length) return undefined;
    return this.players[this.activeIndex];
  }

  reset(players) {
    this.players = players || [];
    this.activeIndex = 0;
  }

  advance() {
    let attempts = 0;

    do {
      this.activeIndex =
        (this.activeIndex + 1) % this.players.length;
      attempts++;
    } while (
      this.players[this.activeIndex].actionCubes === 0 &&
      attempts <= this.players.length
    );
  }

  serialize() {
    return {
      activePlayerId: this.activePlayer ? this.activePlayer.id : null
    };
  }
}
