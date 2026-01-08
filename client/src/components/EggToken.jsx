import React from "react";

export function EggToken({ size = 24 }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size * 1.1,
        backgroundColor: "#E8DCC4",
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        border: "2px solid #D4C4A8",
        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.2)",
        fontSize: size * 0.5
      }}
      title="Egg"
    >
      🥚
    </div>
  );
}

export function EggCounter({ current, max, size = 20 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        {Array.from({ length: Math.min(current, max) }).map((_, i) => (
          <EggToken key={i} size={size} />
        ))}
      </div>
      <span style={{ fontSize: "0.85em", color: "#666", fontWeight: "bold" }}>
        {current}/{max}
      </span>
    </div>
  );
}
