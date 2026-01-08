export function GameOverScreen({ finalScores, players }) {
  if (!finalScores) return <div>Calculating scores...</div>;

  // Sort players by total score
  const rankedScores = Object.entries(finalScores)
    .map(([playerId, score]) => ({
      playerId,
      ...score
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>Game Over!</h1>
      
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {rankedScores.map((playerScore, idx) => (
          <div
            key={playerScore.playerId}
            style={{
              border: "2px solid #ccc",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              backgroundColor: idx === 0 ? "#fff9e6" : "white",
              boxShadow: idx === 0 ? "0 2px 8px rgba(255,215,0,0.3)" : "none"
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {idx === 0 && "🏆 "}
              {idx + 1}. {playerScore.name} - {playerScore.total} points
            </h2>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: "0.95em" }}>
              <div>
                <strong>Bird Points:</strong> {playerScore.birdPoints}
              </div>
              <div>
                <strong>Egg Points:</strong> {playerScore.eggPoints}
              </div>
              <div>
                <strong>Tucked Card Points:</strong> {playerScore.tuckedCardPoints || 0}
              </div>
              <div>
                <strong>Cached Food Points:</strong> {playerScore.cachedFoodPoints || 0}
              </div>
              <div>
                <strong>Bonus Card Points:</strong> {playerScore.bonusPoints}
              </div>
              <div>
                <strong>Round Goal Points:</strong> {playerScore.roundGoalPoints}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "12px 24px",
            fontSize: "1.1em",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
