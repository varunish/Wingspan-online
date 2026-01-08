export class Player {
  constructor(name, socketId) {
    this.id = socketId;            // MUST equal socket.id
    this.name = name;

    this.food = {};
    this.hand = [];
    this.actionCubes = 0;

    this.bonusCard = null;
    this.roundGoalPoints = 0;
    this.roundGoalScores = []; // Track scoring positions each round [{round, position, points, score}]

    this.setup = {
      birds: [],
      bonusCards: [],
      confirmed: false
    };

    this.habitats = {
      forest: [],
      grassland: [],
      wetlands: []
    };

    // Assign player color for action cubes
    this.color = this.generateColor();
  }

  totalEggs() {
    return (
      this.habitats.forest.reduce((sum, b) => sum + (b.eggs || 0), 0) +
      this.habitats.grassland.reduce((sum, b) => sum + (b.eggs || 0), 0) +
      this.habitats.wetlands.reduce((sum, b) => sum + (b.eggs || 0), 0)
    );
  }

  generateColor() {
    // Generate consistent color based on socket ID
    const colors = ["#4A90E2", "#E91E63", "#4CAF50", "#FF9800", "#9C27B0"];
    const hash = this.id.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  }
}
