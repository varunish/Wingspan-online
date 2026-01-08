export class RoundManager {
  constructor(players) {
    this.round = 1;
    this.players = players;
    this.maxRounds = 1;

    this.cubesPerRound = [1];
    this.resetCubes();
  }

  resetCubes() {
    const cubes = this.cubesPerRound[this.round - 1];
    this.players.forEach.tf = this.players.forEach(p => {
      p.actionCubes = cubes;
    });
  }

  consumeCube(player) {
    if (player.actionCubes <= 0) {
      throw new Error("No action cubes remaining");
    }
    player.actionCubes--;
  }

  allPlayersOutOfCubes() {
    return this.players.every(p => p.actionCubes === 0);
  }

  nextRound() {
    if (this.round >= this.maxRounds) {
      return false; // game over
    }

    this.round++;
    this.resetCubes();
    return true;
  }

  serialize() {
    return {
      round: this.round,
      maxRounds: this.maxRounds
    };
  }
}
