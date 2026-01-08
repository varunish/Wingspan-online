import React, { useState } from "react";
import { FoodToken } from "../components/FoodToken.jsx";
import { socket } from "../network/socket.js";

const FOOD_TYPES = ["invertebrate", "seed", "fish", "fruit", "rodent"];

export function FoodConverter({ gameState, myPlayerId, onClose }) {
  const me = gameState.players.find(p => p.id === myPlayerId);
  const [giveFoods, setGiveFoods] = useState([]);
  const [getFood, setGetFood] = useState("");

  // diceTray is now always sent as an array
  const availableInFeeder = gameState.diceTray || [];
  const myFood = me?.food || {};

  const canConvert = giveFoods.length === 2 && getFood && availableInFeeder.includes(getFood);

  const handleFoodClick = (food) => {
    if (giveFoods.length < 2) {
      if ((myFood[food] || 0) > giveFoods.filter(f => f === food).length) {
        setGiveFoods([...giveFoods, food]);
      }
    }
  };

  const handleRemove = (idx) => {
    setGiveFoods(giveFoods.filter((_, i) => i !== idx));
  };

  const handleConvert = () => {
    if (canConvert) {
      socket.emit("convertFood", {
        gameId: gameState.id,
        giveFoods,
        getFood
      });
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        zIndex: 1000,
        minWidth: 400
      }}
    >
      <h3 style={{ marginTop: 0 }}>🔄 Convert Food (2:1)</h3>

      <div style={{ marginBottom: 16 }}>
        <strong>Give 2 food:</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {FOOD_TYPES.map(food => {
            const available = (myFood[food] || 0) - giveFoods.filter(f => f === food).length;
            return (
              <div
                key={food}
                onClick={() => available > 0 && handleFoodClick(food)}
                style={{
                  cursor: available > 0 && giveFoods.length < 2 ? "pointer" : "not-allowed",
                  opacity: available > 0 ? 1 : 0.4
                }}
              >
                <FoodToken type={food} count={available} size={36} />
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Selected to give:</strong>
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {giveFoods.map((food, idx) => (
              <div
                key={idx}
                onClick={() => handleRemove(idx)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <FoodToken type={food} size={32} />
                <span
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -5,
                    backgroundColor: "red",
                    color: "#fff",
                    borderRadius: "50%",
                    width: 18,
                    height: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: "bold"
                  }}
                >
                  ×
                </span>
              </div>
            ))}
            {giveFoods.length === 0 && (
              <div style={{ color: "#999", fontSize: "0.9em" }}>Select 2 food to give</div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <strong>Get 1 food (from birdfeeder):</strong>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {availableInFeeder.map((food, idx) => (
            <div
              key={`${food}-${idx}`}
              onClick={() => setGetFood(food)}
              style={{
                cursor: "pointer",
                border: getFood === food ? "3px solid #4CAF50" : "2px solid transparent",
                borderRadius: "50%",
                padding: 2
              }}
            >
              <FoodToken type={food} size={36} />
            </div>
          ))}
        </div>
        {availableInFeeder.length === 0 && (
          <div style={{ color: "#999", fontSize: "0.9em", marginTop: 8 }}>
            No food in birdfeeder
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button onClick={onClose} style={{ padding: "8px 16px" }}>
          Cancel
        </button>
        <button
          onClick={handleConvert}
          disabled={!canConvert}
          style={{
            padding: "8px 16px",
            backgroundColor: canConvert ? "#4CAF50" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: canConvert ? "pointer" : "not-allowed"
          }}
        >
          Convert
        </button>
      </div>

      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: -1
        }}
      />
    </div>
  );
}
