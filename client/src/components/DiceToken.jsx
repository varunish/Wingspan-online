import React from "react";

const FOOD_COLORS = {
  invertebrate: "#FF6B9D",
  seed: "#FFA726",
  fish: "#42A5F5",
  fruit: "#AB47BC",
  rodent: "#8D6E63"
};

const FOOD_ICONS = {
  invertebrate: "🐛",
  seed: "🌾",
  fish: "🐟",
  fruit: "🍒",
  rodent: "🐭"
};

export function DiceToken({ type, size = 48, onClick, selected }) {
  const color = FOOD_COLORS[type] || "#999";
  const icon = FOOD_ICONS[type] || "?";

  return (
    <div
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: 8,
        backgroundColor: selected ? "#FFD700" : color,
        border: selected ? "4px solid #FFA500" : "3px solid #fff",
        boxShadow: selected
          ? "0 4px 8px rgba(255,165,0,0.5), 0 0 0 2px #FFA500"
          : "0 3px 6px rgba(0,0,0,0.3)",
        fontSize: size * 0.5,
        fontWeight: "bold",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        transform: selected ? "scale(1.1)" : "scale(1)"
      }}
      title={`${type} (click to select)`}
    >
      {icon}
    </div>
  );
}

export function DiceTray({ dice = [], onSelectDice, selectedDice = [] }) {
  if (!dice || dice.length === 0) {
    return (
      <div style={{ padding: 16, color: "#999", textAlign: "center" }}>
        No dice in tray
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        padding: 16,
        backgroundColor: "#2C1810",
        borderRadius: 8,
        flexWrap: "wrap",
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)"
      }}
    >
      {dice.map((diceType, idx) => (
        <DiceToken
          key={`${diceType}-${idx}`}
          type={diceType}
          onClick={onSelectDice ? () => onSelectDice(diceType) : undefined}
          selected={selectedDice.includes(diceType)}
        />
      ))}
    </div>
  );
}
