import React from "react";

// Food token styling based on Wingspan dice
const FOOD_STYLES = {
  invertebrate: {
    background: "linear-gradient(135deg, #FF85A6 0%, #FF6B9D 50%, #E5557F 100%)",
    icon: "🐛",
    shadow: "0 3px 8px rgba(255,107,157,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  seed: {
    background: "linear-gradient(135deg, #FFB84D 0%, #FFA726 50%, #F57C00 100%)",
    icon: "🌾",
    shadow: "0 3px 8px rgba(255,167,38,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  fish: {
    background: "linear-gradient(135deg, #64B5F6 0%, #42A5F5 50%, #1E88E5 100%)",
    icon: "🐟",
    shadow: "0 3px 8px rgba(66,165,245,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  fruit: {
    background: "linear-gradient(135deg, #CE93D8 0%, #AB47BC 50%, #8E24AA 100%)",
    icon: "🍒",
    shadow: "0 3px 8px rgba(171,71,188,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  rodent: {
    background: "linear-gradient(135deg, #A1887F 0%, #8D6E63 50%, #6D4C41 100%)",
    icon: "🐭",
    shadow: "0 3px 8px rgba(141,110,99,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
    border: "3px solid rgba(255,255,255,0.9)"
  },
  wild: {
    background: "linear-gradient(135deg, #FFE082 0%, #FFD700 50%, #FFC107 100%)",
    icon: "⭐",
    shadow: "0 3px 8px rgba(255,215,0,0.5), inset 0 2px 4px rgba(255,255,255,0.4)",
    border: "3px solid rgba(255,255,255,0.95)"
  }
};

export function FoodToken({ type, size = 32, count = 1, style = {} }) {
  const foodStyle = FOOD_STYLES[type] || {
    background: "#999",
    icon: "?",
    shadow: "0 2px 4px rgba(0,0,0,0.2)",
    border: "3px solid #fff"
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: "50%",
        background: foodStyle.background,
        border: foodStyle.border,
        boxShadow: foodStyle.shadow,
        fontSize: size * 0.55,
        fontWeight: "bold",
        position: "relative",
        cursor: "default",
        transition: "transform 0.15s ease",
        ...style
      }}
      title={type.charAt(0).toUpperCase() + type.slice(1)}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <span style={{ 
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
        transform: "translateY(-1px)"
      }}>
        {foodStyle.icon}
      </span>
      {count > 1 && (
        <div
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            background: "linear-gradient(135deg, #444 0%, #222 100%)",
            color: "#fff",
            borderRadius: "50%",
            width: Math.max(20, size * 0.5),
            height: Math.max(20, size * 0.5),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: Math.max(11, size * 0.35),
            fontWeight: "bold",
            border: "2px solid #fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)"
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
