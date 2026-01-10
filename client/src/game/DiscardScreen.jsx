import React, { useState } from "react";
import { socket } from "../network/socket.js";
import { BirdCard } from "../components/BirdCard.jsx";

export function DiscardScreen({ state, myPlayerId }) {
  const me = state.players.find((p) => p.id === myPlayerId);
  const [selectedCards, setSelectedCards] = useState([]);

  if (!me) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  const handSize = me.hand?.length || 0;
  const mustDiscard = handSize - 5;
  const isConfirmed = me.discardConfirmed;

  const toggleCard = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else if (selectedCards.length < mustDiscard) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleConfirm = () => {
    if (selectedCards.length !== mustDiscard) {
      alert(`You must select exactly ${mustDiscard} card(s) to discard`);
      return;
    }

    socket.emit("discardCards", {
      gameId: state.id,
      cardIds: selectedCards
    });
  };

  const confirmedCount = state.players.filter((p) => 
    (p.hand?.length || 0) <= 5 || p.discardConfirmed
  ).length;
  const totalPlayers = state.players.length;

  if (handSize <= 5) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            maxWidth: 600,
            backgroundColor: "#fff",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            padding: 40,
            textAlign: "center"
          }}
        >
          <h2 style={{ color: "#4CAF50", marginBottom: 16 }}>
            ✅ No Cards to Discard
          </h2>
          <p style={{ fontSize: "1.1em", color: "#666", marginBottom: 24 }}>
            You have {handSize} card(s), which is within the limit of 5 cards.
          </p>
          <div style={{ fontSize: "0.9em", color: "#999" }}>
            Waiting for other players to discard... ({confirmedCount}/{totalPlayers} ready)
          </div>
        </div>
      </div>
    );
  }

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
            background: "linear-gradient(135deg, #FF6B6B 0%, #C44569 100%)",
            padding: 24,
            color: "#fff"
          }}
        >
          <h2 style={{ margin: "0 0 8px 0", fontSize: "2em" }}>
            🃏 End of Round - Discard Phase
          </h2>
          <p style={{ margin: 0, opacity: 0.9 }}>
            You must discard down to 5 cards in hand
          </p>
        </div>

        <div style={{ padding: 32 }}>
          {/* Progress */}
          <div
            style={{
              marginBottom: 24,
              padding: 16,
              backgroundColor: "#fff3cd",
              borderRadius: 8,
              border: "2px solid #ffc107"
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
                  Discard Progress
                </strong>
                <div style={{ color: "#666", fontSize: "0.9em", marginTop: 4 }}>
                  {confirmedCount}/{totalPlayers} players ready
                </div>
              </div>
              <div
                style={{
                  fontSize: "2em",
                  color: isConfirmed ? "#4CAF50" : "#FFA726"
                }}
              >
                {isConfirmed ? "✅" : "⏳"}
              </div>
            </div>
          </div>

          {!isConfirmed ? (
            <>
              {/* Selection Info */}
              <div
                style={{
                  marginBottom: 24,
                  padding: 16,
                  backgroundColor: "#ffebee",
                  borderRadius: 8,
                  border: "2px solid #f44336"
                }}
              >
                <div style={{ fontSize: "1.1em", fontWeight: "bold", color: "#333", marginBottom: 8 }}>
                  📋 Instructions
                </div>
                <div style={{ color: "#666" }}>
                  You have <strong>{handSize} cards</strong> in hand.
                  {" "}Select <strong>{mustDiscard} card(s)</strong> to discard.
                </div>
                <div
                  style={{
                    marginTop: 12,
                    padding: "8px 16px",
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    display: "inline-block"
                  }}
                >
                  <strong>Selected: {selectedCards.length}/{mustDiscard}</strong>
                </div>
              </div>

              {/* Card Selection */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 16,
                  marginBottom: 24
                }}
              >
                {(me.hand || []).map((card, idx) => (
                  <div
                    key={card.instanceId || `${card.id}-${idx}`}
                    onClick={() => toggleCard(card.id)}
                    style={{
                      cursor: "pointer",
                      opacity: selectedCards.includes(card.id) ? 0.5 : 1,
                      transition: "all 0.2s",
                      transform: selectedCards.includes(card.id) ? "scale(0.95)" : "scale(1)"
                    }}
                  >
                    <BirdCard
                      bird={card}
                      selected={selectedCards.includes(card.id)}
                    />
                  </div>
                ))}
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={selectedCards.length !== mustDiscard}
                style={{
                  width: "100%",
                  padding: "16px 24px",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  color: "#fff",
                  backgroundColor: selectedCards.length === mustDiscard ? "#4CAF50" : "#ccc",
                  border: "none",
                  borderRadius: 12,
                  cursor: selectedCards.length === mustDiscard ? "pointer" : "not-allowed",
                  transition: "all 0.3s",
                  boxShadow: selectedCards.length === mustDiscard
                    ? "0 4px 12px rgba(76, 175, 80, 0.4)"
                    : "none"
                }}
              >
                ✅ Confirm Discard
              </button>
            </>
          ) : (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                backgroundColor: "#f0f4ff",
                borderRadius: 12
              }}
            >
              <div style={{ fontSize: "3em", marginBottom: 16 }}>✅</div>
              <h3 style={{ color: "#4CAF50", marginBottom: 12 }}>
                Discard Complete!
              </h3>
              <p style={{ color: "#666", fontSize: "1.1em" }}>
                Waiting for other players to finish discarding...
              </p>
              <div style={{ marginTop: 24, fontSize: "0.9em", color: "#999" }}>
                ({confirmedCount}/{totalPlayers} players ready)
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
