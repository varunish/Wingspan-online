import React from "react";
import { ActionCube } from "../components/ActionCube.jsx";

// Round goal scoring points by round and position
const SCORING_TABLE = {
  1: { first: 5, second: 2, third: 1, fourth: 0 },
  2: { first: 6, second: 3, third: 2, fourth: 0 },
  3: { first: 7, second: 4, third: 2, fourth: 0 },
  4: { first: 8, second: 5, third: 3, fourth: 0 }
};

export function RoundGoalScorer({ roundGoals, players, currentRound }) {
  return (
    <div
      style={{
        border: "3px solid #8B4513",
        borderRadius: 12,
        padding: 16,
        backgroundColor: "#F5E6D3",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        height: "fit-content",
        minHeight: "400px"
      }}
    >
      <h3 style={{ margin: "0 0 16px 0", color: "#5D4037", fontSize: "1.3em" }}>
        🏆 Round Goal Scoring
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3, 4].map((round) => {
          const goal = roundGoals[round - 1];
          const isCurrentRound = round === currentRound;
          const isPastRound = round < currentRound;

          return (
            <div
              key={round}
              style={{
                display: "grid",
                gridTemplateColumns: "120px 1fr",
                gap: 12,
                padding: 12,
                backgroundColor: isCurrentRound ? "#FFD700" : "#fff",
                border: isCurrentRound
                  ? "3px solid #FFA500"
                  : "2px solid #D7CCC8",
                borderRadius: 8,
                opacity: isPastRound ? 1 : isCurrentRound ? 1 : 0.6
              }}
            >
              {/* Round Goal */}
              <div
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  padding: 8,
                  borderRadius: 6,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: "0.8em", fontWeight: "bold" }}>
                  ROUND {round}
                </div>
                {goal && (
                  <div style={{ fontSize: "0.7em", marginTop: 4 }}>
                    {goal.name}
                  </div>
                )}
              </div>

              {/* Scoring Positions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 8
                }}
              >
                {["first", "second", "third", "fourth"].map((position, idx) => {
                  const points = SCORING_TABLE[round][position];
                  const positionLabel =
                    idx === 0
                      ? "1ST"
                      : idx === 1
                      ? "2ND"
                      : idx === 2
                      ? "3RD"
                      : "0PT";

                  // Find players who scored this position in this round
                  const playersInPosition = players.filter(
                    (p) =>
                      p.roundGoalScores &&
                      p.roundGoalScores[round - 1] &&
                      p.roundGoalScores[round - 1].position === position
                  );

                  return (
                    <div
                      key={position}
                      style={{
                        backgroundColor:
                          points > 0 ? "#C8E6C9" : "#FFCCBC",
                        padding: 8,
                        borderRadius: 6,
                        textAlign: "center",
                        border: "2px solid #8B4513"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.7em",
                          fontWeight: "bold",
                          color: "#5D4037"
                        }}
                      >
                        {positionLabel}
                      </div>
                      <div
                        style={{
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          color: "#2E7D32",
                          marginTop: 4
                        }}
                      >
                        {points}
                      </div>

                      {/* Show action cubes of players in this position */}
                      {isPastRound && playersInPosition.length > 0 && (
                        <div
                          style={{
                            marginTop: 8,
                            display: "flex",
                            gap: 4,
                            justifyContent: "center",
                            flexWrap: "wrap"
                          }}
                        >
                          {playersInPosition.map((p) => (
                            <div
                              key={p.id}
                              title={p.name}
                              style={{ position: "relative" }}
                            >
                              <ActionCube
                                color={p.color || "#4A90E2"}
                                size={16}
                              />
                              <div
                                style={{
                                  position: "absolute",
                                  top: -8,
                                  right: -8,
                                  fontSize: "0.6em",
                                  backgroundColor: "#fff",
                                  borderRadius: "50%",
                                  width: 14,
                                  height: 14,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  border: "1px solid #333"
                                }}
                              >
                                {p.name.charAt(0)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          padding: 8,
          backgroundColor: "rgba(255,255,255,0.7)",
          borderRadius: 4,
          fontSize: "0.8em",
          color: "#5D4037"
        }}
      >
        <strong>Note:</strong> Players place an action cube on their scoring
        position after each round. This cube remains there (reducing available
        cubes) until game end.
      </div>
    </div>
  );
}
