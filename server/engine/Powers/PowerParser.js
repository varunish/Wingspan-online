/**
 * Parses bird power text descriptions into structured effect types
 */
export class PowerParser {
  /**
   * Parse a power text description and return structured effect data
   * @param {Object} power - The power object with type and effect fields
   * @returns {Object} - Structured power data with effectType and parameters
   */
  static parse(power) {
    if (!power || !power.effect) {
      return { effectType: "NONE", params: {} };
    }

    const text = power.effect.toLowerCase();

    // Check for "When another player" - these are between-turn powers
    if (text.includes("when another player")) {
      return this.parseBetweenTurnPower(text, power);
    }

    // Check for common WHEN_ACTIVATED patterns
    if (text.includes("all players draw") && text.includes("card")) {
      return { effectType: "ALL_PLAYERS_DRAW", params: { count: 1 } };
    }

    if (text.includes("draw") && text.includes("bonus card")) {
      return { effectType: "DRAW_BONUS_CARDS", params: { draw: 2, keep: 1 } };
    }

    if (text.includes("look at") && text.includes("card") && text.includes("tuck")) {
      // Powers like "Look at a card from deck, if <75cm tuck it"
      const wingspan = text.match(/<(\d+)cm/);
      return { 
        effectType: "CONDITIONAL_TUCK", 
        params: { 
          maxWingspan: wingspan ? parseInt(wingspan[1]) : 75,
          drawCount: 1 
        } 
      };
    }

    if (text.includes("tuck") && text.includes("card") && text.includes("hand")) {
      if (text.includes("lay") && text.includes("egg")) {
        return { effectType: "TUCK_AND_LAY_EGG", params: { eggs: 1 } };
      }
      return { effectType: "TUCK_CARD", params: { count: 1 } };
    }

    // Default to extracting basic actions
    if (text.includes("gain") || text.includes("draw") || text.includes("lay")) {
      return this.parseBasicAction(text);
    }

    return { effectType: "CUSTOM", params: { text: power.effect } };
  }

  static parseBetweenTurnPower(text, power) {
    // Powers that trigger when other players take actions
    if (text.includes('"gain food"') && text.includes("rodent")) {
      return { 
        effectType: "WHEN_OTHER_GAINS_FOOD", 
        params: { foodType: "rodent", cache: true } 
      };
    }

    if (text.includes('"lay eggs"')) {
      const nestType = this.extractNestType(text);
      return { 
        effectType: "WHEN_OTHER_LAYS_EGGS", 
        params: { nestType, eggCount: 1 } 
      };
    }

    if (text.includes("plays a") && text.includes("bird")) {
      const habitat = this.extractHabitat(text);
      const foodType = this.extractFoodType(text);
      return { 
        effectType: "WHEN_OTHER_PLAYS_BIRD", 
        params: { habitat, foodType } 
      };
    }

    if (text.includes("predator succeeds")) {
      return { 
        effectType: "WHEN_OTHER_PREDATOR_SUCCEEDS", 
        params: { gainFromFeeder: true } 
      };
    }

    return { effectType: "BETWEEN_TURNS", params: { text: power.effect } };
  }

  static parseBasicAction(text) {
    // Extract numbers
    const numbers = text.match(/\d+/g);
    const count = numbers && numbers.length > 0 ? parseInt(numbers[0]) : 1;

    if (text.includes("draw") && text.includes("card")) {
      return { effectType: "DRAW_CARD", params: { count } };
    }

    if (text.includes("lay") && text.includes("egg")) {
      return { effectType: "LAY_EGG", params: { count } };
    }

    if (text.includes("gain") && (text.includes("food") || text.includes("die"))) {
      const foodType = this.extractFoodType(text);
      return { effectType: "GAIN_FOOD", params: { foodType, count } };
    }

    if (text.includes("cache") && text.includes("food")) {
      const foodType = this.extractFoodType(text);
      return { effectType: "CACHE_FOOD", params: { foodType, count } };
    }

    return { effectType: "UNKNOWN", params: { text } };
  }

  static extractNestType(text) {
    if (text.includes("[ground]")) return "ground";
    if (text.includes("[bowl]")) return "bowl";
    if (text.includes("[cavity]")) return "cavity";
    if (text.includes("[platform]")) return "platform";
    return "any";
  }

  static extractHabitat(text) {
    if (text.includes("[forest]")) return "forest";
    if (text.includes("[grassland]")) return "grasslands";
    if (text.includes("[wetland]")) return "wetlands";
    return "any";
  }

  static extractFoodType(text) {
    if (text.includes("[invertebrate]") || text.includes("invertebrate")) return "invertebrate";
    if (text.includes("[seed]") || text.includes("seed")) return "seed";
    if (text.includes("[fish]") || text.includes("fish")) return "fish";
    if (text.includes("[fruit]") || text.includes("fruit")) return "fruit";
    if (text.includes("[rodent]") || text.includes("rodent")) return "rodent";
    if (text.includes("[die]") || text.includes("birdfeeder")) return "wild";
    return "wild";
  }
}
