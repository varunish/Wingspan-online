import React from "react";
import { FoodToken } from "./FoodToken.jsx";
import { EggCounter } from "./EggToken.jsx";
import { Tooltip } from "./Tooltip.jsx";

const HABITAT_COLORS = {
  forest: "#2E7D32",
  grassland: "#F9A825",
  wetlands: "#1976D2"
};

export function BirdCard({ bird, onClick, selected, compact = false, showEggs = false }) {
  if (!bird) return null;

  const habitatColor = HABITAT_COLORS[bird.habitats?.[0]] || "#666";
  
  // Try to load actual card image
  const cardImagePath = `/assets/birds/fronts/${bird.id}.jpg`;
  const [imageExists, setImageExists] = React.useState(true);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  if (compact) {
    return (
      <Tooltip text={bird.name}>
        <div
          onClick={onClick}
          style={{
            width: 60,
            height: 80,
            backgroundColor: habitatColor,
            borderRadius: 6,
            border: selected ? "3px solid #FFD700" : "2px solid #333",
            boxShadow: selected
              ? "0 4px 8px rgba(255,215,0,0.5)"
              : "0 2px 4px rgba(0,0,0,0.3)",
            cursor: onClick ? "pointer" : "default",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "0.7em",
            textAlign: "center",
            padding: 4,
            position: "relative"
          }}
        >
          <div style={{ fontWeight: "bold" }}>{bird.points}★</div>
          {showEggs && bird.eggs > 0 && (
            <div style={{ fontSize: "0.8em", marginTop: 2 }}>
              🥚{bird.eggs}
            </div>
          )}
        </div>
      </Tooltip>
    );
  }

  // Try to show image version first
  if (imageExists) {
    return (
      <div
        onClick={onClick}
        style={{
          width: 180,
          height: 250,
          borderRadius: 12,
          border: selected ? "4px solid #FFD700" : "3px solid #333",
          boxShadow: selected
            ? "0 6px 12px rgba(255,215,0,0.6)"
            : "0 4px 8px rgba(0,0,0,0.3)",
          cursor: onClick ? "pointer" : "default",
          overflow: "hidden",
          transition: "all 0.2s ease",
          transform: selected ? "scale(1.05)" : "scale(1)",
          position: "relative"
        }}
      >
        <img
          src={cardImagePath}
          alt={bird.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: imageLoaded ? 'block' : 'none'
          }}
          onError={() => setImageExists(false)}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: habitatColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.9em'
          }}>Loading...</div>
        )}
        {showEggs && bird.eggs > 0 && imageLoaded && (
          <div style={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.95)',
            padding: '4px 8px',
            borderRadius: 12,
            fontSize: '0.85em',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            <EggCounter current={bird.eggs || 0} max={bird.eggCapacity || 6} size={16} />
          </div>
        )}
      </div>
    );
  }

  // Fallback to styled version if image fails to load
  return (
    <div
      onClick={onClick}
      style={{
        width: 180,
        height: 250,
        backgroundColor: "#F5F5DC",
        borderRadius: 12,
        border: selected ? "4px solid #FFD700" : "3px solid #333",
        boxShadow: selected
          ? "0 6px 12px rgba(255,215,0,0.6)"
          : "0 4px 8px rgba(0,0,0,0.3)",
        cursor: onClick ? "pointer" : "default",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "all 0.2s ease",
        transform: selected ? "scale(1.05)" : "scale(1)"
      }}
    >
      {/* Header with habitat */}
      <div
        style={{
          backgroundColor: habitatColor,
          color: "#fff",
          padding: "6px 8px",
          fontWeight: "bold",
          fontSize: "0.75em",
          textTransform: "uppercase",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span>{bird.habitats?.[0] || "Unknown"}</span>
        <span style={{ fontSize: "1.2em" }}>{bird.points}★</span>
      </div>

      {/* Bird name */}
      <div
        style={{
          padding: "8px",
          fontSize: "0.95em",
          fontWeight: "bold",
          textAlign: "center",
          borderBottom: "1px solid #ccc",
          minHeight: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {bird.name}
      </div>

      {/* Food cost */}
      <div
        style={{
          padding: "8px",
          display: "flex",
          gap: 4,
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
          minHeight: 50
        }}
      >
        {bird.foodCost && bird.foodCost.length > 0 ? (
          bird.foodCost.map((food, idx) => (
            <FoodToken key={`${food}-${idx}`} type={food} size={28} />
          ))
        ) : (
          <span style={{ fontSize: "0.8em", color: "#999" }}>No cost</span>
        )}
      </div>

      {/* Egg capacity */}
      <div
        style={{
          padding: "8px",
          fontSize: "0.85em",
          textAlign: "center",
          borderBottom: "1px solid #ccc"
        }}
      >
        <strong>Egg Capacity:</strong> {bird.eggCapacity || 6}
        {showEggs && (
          <div style={{ marginTop: 4 }}>
            <EggCounter current={bird.eggs || 0} max={bird.eggCapacity || 6} size={16} />
          </div>
        )}
      </div>

      {/* Bird power */}
      <div
        style={{
          padding: "8px",
          fontSize: "0.75em",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: bird.power ? "#f0fff0" : "transparent"
        }}
      >
        {bird.power ? (
          <>
            <div style={{ fontWeight: "bold", color: "#2e7d32", marginBottom: 4 }}>
              ⚡ {bird.power.type}
            </div>
            <div style={{ color: "#555" }}>
              {bird.power.effect}
              {bird.power.value && bird.power.value > 1 && ` (×${bird.power.value})`}
            </div>
          </>
        ) : (
          <div style={{ color: "#999", textAlign: "center" }}>No special power</div>
        )}
      </div>

      {/* Cached/Tucked indicators */}
      {(bird.cachedFood?.length > 0 || bird.tuckedCards?.length > 0) && (
        <div
          style={{
            padding: "4px 8px",
            fontSize: "0.75em",
            backgroundColor: "#fff3cd",
            display: "flex",
            justifyContent: "space-around"
          }}
        >
          {bird.cachedFood?.length > 0 && (
            <span>🍖 Cached: {bird.cachedFood.length}</span>
          )}
          {bird.tuckedCards?.length > 0 && (
            <span>📄 Tucked: {bird.tuckedCards.length}</span>
          )}
        </div>
      )}
    </div>
  );
}
