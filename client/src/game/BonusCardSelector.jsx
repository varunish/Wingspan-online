import React, { useState } from "react";
import { socket } from "../network/socket.js";

export function BonusCardSelector({ gameId, bonusCards, birdName, onClose }) {
  const [selectedCard, setSelectedCard] = useState(null);

  const handleConfirm = () => {
    if (!selectedCard) {
      alert("Please select a bonus card!");
      return;
    }

    socket.emit("selectBonusCard", {
      gameId: gameId,
      selectedCardId: selectedCard.instanceId || selectedCard.id
    });

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "20px"
      }}
      onClick={(e) => {
        // Close if clicking backdrop
        if (e.target === e.currentTarget) {
          // Don't close, force selection
        }
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 32,
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 8px 0", color: "#333", fontSize: "1.8em" }}>
            🎴 Select a Bonus Card
          </h2>
          <p style={{ margin: 0, color: "#666", fontSize: "1.1em" }}>
            {birdName}'s power lets you draw bonus cards. Choose one to keep:
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 20,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 24
          }}
        >
          {bonusCards.map((card) => {
            const bonusImagePath = `/assets/bonus/${card.id}.jpg`;
            const isSelected = selectedCard && (selectedCard.instanceId || selectedCard.id) === (card.instanceId || card.id);

            return (
              <div
                key={card.instanceId || card.id}
                onClick={() => setSelectedCard(card)}
                style={{
                  flex: "0 0 auto",
                  width: 280,
                  height: 390,
                  border: isSelected
                    ? "5px solid #4CAF50"
                    : "3px solid #333",
                  borderRadius: 12,
                  backgroundColor: "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: isSelected
                    ? "0 12px 24px rgba(76,175,80,0.6)"
                    : "0 4px 8px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: isSelected ? "scale(1.05)" : "scale(1)"
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 20,
                      fontSize: "0.9em",
                      fontWeight: "bold",
                      zIndex: 10,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
                    }}
                  >
                    ✓ Selected
                  </div>
                )}
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
                      <div style="font-size: 1.3em; font-weight: bold; margin-bottom: 12px; color: #333;">
                        ${card.name}
                      </div>
                      <div style="color: #666; font-size: 1em; line-height: 1.5;">
                        ${card.description || "Bonus card"}
                      </div>
                    `;
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={handleConfirm}
            disabled={!selectedCard}
            style={{
              padding: "14px 32px",
              fontSize: "1.2em",
              fontWeight: "600",
              color: "#fff",
              background: selectedCard
                ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                : "#ccc",
              border: "none",
              borderRadius: 8,
              cursor: selectedCard ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              boxShadow: selectedCard ? "0 4px 12px rgba(76,175,80,0.4)" : "none"
            }}
            onMouseEnter={(e) => {
              if (selectedCard) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 16px rgba(76,175,80,0.5)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = selectedCard ? "0 4px 12px rgba(76,175,80,0.4)" : "none";
            }}
          >
            ✓ Confirm Selection
          </button>
        </div>

        <div
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: "#fff3cd",
            borderRadius: 8,
            border: "2px solid #ffc107",
            textAlign: "center",
            color: "#856404",
            fontSize: "0.95em"
          }}
        >
          ⚠️ You must select one card. The other will be returned to the deck.
        </div>
      </div>
    </div>
  );
}
