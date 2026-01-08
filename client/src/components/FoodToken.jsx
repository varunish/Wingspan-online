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

export function FoodToken({ type, size = 32, count = 1, style = {} }) {
  const color = FOOD_COLORS[type] || "#999";
  const icon = FOOD_ICONS[type] || "?";

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: color,
        border: "3px solid #fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
        fontSize: size * 0.5,
        fontWeight: "bold",
        position: "relative",
        ...style
      }}
      title={type}
    >
      {icon}
      {count > 1 && (
        <div
          style={{
            position: "absolute",
            top: -5,
            right: -5,
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: "50%",
            width: 18,
            height: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: "bold",
            border: "2px solid #fff"
          }}
        >
          {count}
        </div>
      )}
    </div>
  );
}

export function FoodTokenList({ food, size = 32 }) {
  const foodTypes = Object.keys(food || {}).filter(f => (food[f] || 0) > 0);

  if (foodTypes.length === 0) {
    return <div style={{ color: "#999", fontSize: "0.9em" }}>No food</div>;
  }

  return (
    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
      {foodTypes.map(type => (
        <FoodToken key={type} type={type} count={food[type]} size={size} />
      ))}
    </div>
  );
}
