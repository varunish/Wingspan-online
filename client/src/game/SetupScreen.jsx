import React, { useState } from "react";
import { socket } from "../network/socket.js";
import { BirdCard } from "../components/BirdCard.jsx";

export function SetupScreen({ state, myPlayerId }) {
  const me = state.players.find((p) => p.id === myPlayerId);
  const [selectedBirds, setSelectedBirds] = useState([]);
  const [selectedBonusCard, setSelectedBonusCard] = useState(null);

  if (!me || !me.setup) {
    return <div style={{ padding: 20 }}>Loading setup...</div>;
  }

  const availableBirds = (me.setup.birds || []).filter((b) => b);
  const bonusCards = me.setup.bonusCards || [];
  const maxKeep = 5;
  const foodCost = maxKeep - selectedBirds.length;

  const toggleBird = (birdId) => {
    if (selectedBirds.includes(birdId)) {
      setSelectedBirds(selectedBirds.filter((id) => id !== birdId));
    } else {
      setSelectedBirds([...selectedBirds, birdId]);
    }
  };

  const handleConfirm = () => {
    if (!selectedBonusCard) {
      alert("Please select a bonus card!");
      return;
    }

    socket.emit("confirmSetup", {
      gameId: state.id,
      keptBirdIds: selectedBirds,
      bonusCardId: selectedBonusCard
    });
  };

  const confirmedCount = state.players.filter((p) => p.setup?.confirmed).length;
  const totalPlayers = state.players.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 20
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          backgroundColor: "#fff",
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden"
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: 24,
            color: "#fff"
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", fontSize: "2em" }}>
            🎯 Game Setup
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            Choose which birds to keep and select a bonus card
          </p>
        </div>

        <div style={{ padding: 32 }}>
          {/* Progress */}
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              backgroundColor: "#f0f4ff",
              borderRadius: 8,
              border: "2px solid #667eea"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div>
                <strong style={{ fontSize: "1.1em", color: "#333" }}>
                  Setup Progress
                </strong>
                <div style={{ color: "#666", fontSize: "0.9em", marginTop: 4 }}>
                  {confirmedCount}/{totalPlayers} players confirmed
                </div>
              </div>
              <div
                style={{
                  fontSize: "2em",
                  color: me.setup.confirmed ? "#4CAF50" : "#FFA726"
                }}
              >
                {me.setup.confirmed ? "✅" : "⏳"}
              </div>
            </div>
          </div>

          {/* Round Goals Display */}
          {state.roundGoals && state.roundGoals.length > 0 && (
            <div
              style={{
                marginBottom: 24,
                padding: 20,
                backgroundColor: "#fff3cd",
                borderRadius: 8,
                border: "2px solid #ffc107"
              }}
            >
              <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
                🏆 Round Goals for This Game
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12
                }}
              >
                {state.roundGoals.map((goal, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: 12,
                      backgroundColor: "#fff",
                      borderRadius: 8,
                      border: "1px solid #e0e0e0"
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#667eea",
                        marginBottom: 4
                      }}
                    >
                      Round {idx + 1}
                    </div>
                    <div style={{ fontSize: "0.9em", color: "#333" }}>
                      {goal.name || goal.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!me.setup.confirmed ? (
            <>
              {/* Bird Selection */}
              <div style={{ marginBottom: 32 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 16
                  }}
                >
                  <h3 style={{ margin: 0, color: "#333" }}>
                    🐦 Select Birds to Keep
                  </h3>
                  <div
                    style={{
                      padding: "8px 16px",
                      backgroundColor: "#fffbea",
                      borderRadius: 8,
                      border: "2px solid #ffd700"
                    }}
                  >
                    <strong>Selected: {selectedBirds.length}/5</strong>
                    <div style={{ fontSize: "0.85em", color: "#666" }}>
                      Cost: {foodCost} food
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 16
                  }}
                >
                  {availableBirds.map((bird, idx) => (
                    <div
                      key={bird.instanceId || `${bird.id}-${idx}`}
                      onClick={() => toggleBird(bird.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <BirdCard
                        bird={bird}
                        selected={selectedBirds.includes(bird.id)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bonus Card Selection */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
                  🎴 Select Bonus Card (Choose 1)
                </h3>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {bonusCards.map((card) => {
                    const bonusImagePath = `/assets/bonus/${card.id}.jpg`;
                    return (
                      <div
                        key={card.id}
                        onClick={() => setSelectedBonusCard(card.id)}
                        style={{
                          flex: "0 0 auto",
                          width: 250,
                          height: 350,
                          border:
                            selectedBonusCard === card.id
                              ? "4px solid #FFD700"
                              : "3px solid #333",
                          borderRadius: 12,
                          backgroundColor: "#fff",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          boxShadow:
                            selectedBonusCard === card.id
                              ? "0 8px 16px rgba(255,215,0,0.6)"
                              : "0 4px 8px rgba(0,0,0,0.3)",
                          overflow: "hidden",
                          position: "relative",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <img
                          src={bonusImagePath}
                          alt={card.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"
                          }}
                          onError={(e) => {
                            // Fallback to text if image doesn't exist
                            e.target.style.display = "none";
                            const fallback = document.createElement("div");
                            fallback.style.padding = "20px";
                            fallback.style.textAlign = "center";
                            fallback.innerHTML = `
                              <div style="font-size: 1.2em; font-weight: bold; margin-bottom: 8px; color: #333;">
                                ${card.name}
                              </div>
                              <div style="color: #666; font-size: 0.95em;">
                                ${card.description}
                              </div>
                            `;
                            e.target.parentElement.appendChild(fallback);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={!selectedBonusCard}
                style={{
                  width: "100%",
                  padding: "16px",
                  fontSize: "1.2em",
                  fontWeight: "600",
                  color: "#fff",
                  background: selectedBonusCard
                    ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                    : "#ccc",
                  border: "none",
                  borderRadius: 8,
                  cursor: selectedBonusCard ? "pointer" : "not-allowed",
                  transition: "transform 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (selectedBonusCard)
                    e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                }}
              >
                ✅ Confirm Selection
              </button>
            </>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 60,
                color: "#666",
                fontSize: "1.2em"
              }}
            >
              <div style={{ fontSize: "4em", marginBottom: 16 }}>✅</div>
              <div style={{ fontSize: "1.5em", fontWeight: "600", marginBottom: 8 }}>
                Setup Complete!
              </div>
              <div>Waiting for other players...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
