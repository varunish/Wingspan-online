import { DiceTray } from "../components/DiceToken.jsx";
import { BirdCard } from "../components/BirdCard.jsx";

export function SharedBoard({ diceTray = [], logs = [], roundGoals = [], currentRoundGoal, round, birdTray = [] }) {
  return (
    <div
      className="shared-board"
      style={{
        marginBottom: 16,
        border: "3px solid #8B4513",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#E8DCC4",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
      }}
    >
      <h3
        style={{
          margin: 0,
          marginBottom: 16,
          color: "#5D4037",
          fontSize: "1.3em"
        }}
      >
        🎲 Shared Board
      </h3>

      {/* Food Dice Tray & Face-Up Birds - Side by Side */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16, marginBottom: 16 }}>
        {/* Food Dice Tray */}
        <div>
          <strong style={{ display: "block", marginBottom: 8, fontSize: "1.1em" }}>
            Food Dice Tray:
          </strong>
          <DiceTray dice={diceTray} />
        </div>

        {/* Face-Up Birds */}
        <div>
          <strong
            style={{
              display: "block",
              marginBottom: 8,
              fontSize: "1.1em"
            }}
          >
            🐦 Face-up Bird Tray:
          </strong>
          <div
            style={{
              display: "flex",
              gap: 12,
              overflowX: "auto",
              padding: 8,
              backgroundColor: "rgba(255,255,255,0.5)",
              borderRadius: 8
            }}
          >
            {birdTray && birdTray.length > 0 ? (
              birdTray.map((bird, idx) =>
                bird ? (
                  <BirdCard
                    key={bird.instanceId || `${bird.id}-${idx}`}
                    bird={bird}
                    compact={false}
                  />
                ) : (
                  <div
                    key={idx}
                    style={{
                      width: 180,
                      height: 250,
                      border: "2px dashed #999",
                      borderRadius: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999"
                    }}
                  >
                    Empty
                  </div>
                )
              )
            ) : (
              <div style={{ color: "#999", padding: 8 }}>No birds available</div>
            )}
          </div>
        </div>
      </div>

      {/* Game Logs */}
      <div>
        <strong
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: "1.1em"
          }}
        >
          📜 Game Log:
        </strong>
        <div
          style={{
            maxHeight: 150,
            overflowY: "auto",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #D7CCC8",
            fontSize: "0.85em"
          }}
        >
          {logs && logs.length > 0 ? (
            logs.slice(-15).map((log, i) => (
              <div
                key={i}
                style={{
                  padding: "4px 0",
                  borderBottom: i < logs.slice(-15).length - 1 ? "1px solid #eee" : "none",
                  color: log.includes("activated") ? "#2e7d32" : "#333",
                  fontWeight: log.includes("activated") ? "600" : "normal"
                }}
              >
                {log}
              </div>
            ))
          ) : (
            <div style={{ color: "#999", textAlign: "center" }}>No logs yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
