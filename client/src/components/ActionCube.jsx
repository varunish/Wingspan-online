import React from "react";

export function ActionCube({ color = "#4A90E2", size = 24 }) {
  return (
    <div
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        border: "2px solid #fff",
        borderRadius: 4,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.3)",
        position: "relative"
      }}
      title="Action cube"
    >
      <div
        style={{
          position: "absolute",
          top: 2,
          left: 2,
          width: size * 0.3,
          height: size * 0.3,
          backgroundColor: "rgba(255,255,255,0.4)",
          borderRadius: 2
        }}
      />
    </div>
  );
}

export function ActionCubeCounter({ count, maxCount, color = "#4A90E2" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: count }).map((_, i) => (
          <ActionCube key={i} color={color} size={20} />
        ))}
      </div>
      <span style={{ fontSize: "0.9em", fontWeight: "bold", color: "#333" }}>
        {count}/{maxCount}
      </span>
    </div>
  );
}
