const FOOD_FACES = ["seed", "invertebrate", "fish", "fruit", "rodent"];

export class DiceTray {
  constructor() {
    this.refill();
  }

  refill() {
    this.dice = [];
    for (let i = 0; i < 5; i++) {
      this.dice.push(this.roll());
    }
  }

  roll() {
    return FOOD_FACES[Math.floor(Math.random() * FOOD_FACES.length)];
  }

  take(food) {
    const i = this.dice.indexOf(food);
    if (i === -1) throw new Error("Food not available");
    this.dice[i] = this.roll();
    return food;
  }

  serialize() {
    return [...this.dice];
  }
}
