import { DiceTray } from "../components/DiceToken.jsx";
import { BirdCard } from "../components/BirdCard.jsx";

export function SharedBoard({ diceTray = [], logs = [], roundGoals = [], currentRoundGoal, round, birdTray = [] }) {
  return (
    <div
      className="shared-board"
      style={{
        border: "3px solid #8B4513",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#E8DCC4",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        height: "fit-content",
        minHeight: "400px",
        display: "flex",
        flexDirection: "column"
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

      {/* Food Dice Tray */}
      <div style={{ marginBottom: 16 }}>
        <strong style={{ display: "block", marginBottom: 8, fontSize: "1em", color: "#5D4037" }}>
          Food Dice Tray:
        </strong>
        <DiceTray dice={diceTray} />
      </div>

      {/* Face-Up Birds */}
      <div style={{ marginBottom: 16, flex: 1 }}>
        <strong
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: "1em",
            color: "#5D4037"
          }}
        >
          🐦 Face-up Bird Tray:
        </strong>
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: 8,
            backgroundColor: "rgba(255,255,255,0.5)",
            borderRadius: 8,
            minHeight: "100px"
          }}
        >
            {birdTray && birdTray.length > 0 ? (
              birdTray.map((bird, idx) =>
                bird ? (
                  <div key={bird.instanceId || `${bird.id}-${idx}`} style={{ flexShrink: 0 }}>
                    <BirdCard
                      bird={bird}
                      compact={false}
                    />
                  </div>
                ) : (
                  <div
                    key={idx}
                    style={{
                      width: 150,
                      height: 210,
                      border: "2px dashed #999",
                      borderRadius: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      flexShrink: 0,
                      fontSize: "0.9em"
                    }}
                  >
                    Empty
                  </div>
                )
              )
            ) : (
              <div style={{ color: "#999", padding: 8, fontSize: "0.9em" }}>No birds available</div>
            )}
          </div>
      </div>

      {/* Game Logs */}
      <div style={{ marginTop: "auto" }}>
        <strong
          style={{
            display: "block",
            marginBottom: 8,
            fontSize: "1em",
            color: "#5D4037"
          }}
        >
          📜 Game Log:
        </strong>
        <div
          style={{
            maxHeight: 120,
            overflowY: "auto",
            backgroundColor: "rgba(255,255,255,0.9)",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #D7CCC8",
            fontSize: "0.8em"
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
