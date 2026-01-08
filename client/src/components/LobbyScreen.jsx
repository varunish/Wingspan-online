import React, { useState } from "react";
import { socket } from "../network/socket.js";

export function LobbyScreen({ lobby, onStartGame }) {
  const [playerName, setPlayerName] = useState("");
  const [lobbyCode, setLobbyCode] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);

  const isHost = lobby?.players?.[0]?.id === socket.id;
  const canStart = lobby?.players?.length >= 2;

  const handleCreateLobby = () => {
    if (playerName.trim()) {
      socket.emit("createLobby", { playerName: playerName.trim() });
    }
  };

  const handleJoinLobby = () => {
    if (playerName.trim() && lobbyCode.trim()) {
      socket.emit("joinLobby", {
        lobbyId: lobbyCode.trim().toUpperCase(),
        playerName: playerName.trim()
      });
    }
  };

  const handleStartGame = () => {
    if (isHost && canStart) {
      socket.emit("startGame", { lobbyId: lobby.id });
    }
  };

  if (!lobby) {
    // Pre-lobby: Create or Join
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20
        }}
      >
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            padding: 40
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1
              style={{
                fontSize: "2.5em",
                margin: "0 0 8px 0",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: "bold"
              }}
            >
              🦅 Wingspan
            </h1>
            <p style={{ color: "#666", margin: 0, fontSize: "1.1em" }}>
              Online Multiplayer Edition
            </p>
          </div>

          {/* Player Name Input */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: "600",
                color: "#333"
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "1em",
                border: "2px solid #e0e0e0",
                borderRadius: 8,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => (e.target.style.borderColor = "#667eea")}
              onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
            />
          </div>

          {/* Create Lobby Button */}
          <button
            onClick={handleCreateLobby}
            disabled={!playerName.trim()}
            style={{
              width: "100%",
              padding: "14px",
              fontSize: "1.1em",
              fontWeight: "600",
              color: "#fff",
              background: playerName.trim()
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "#ccc",
              border: "none",
              borderRadius: 8,
              cursor: playerName.trim() ? "pointer" : "not-allowed",
              marginBottom: 16,
              transition: "transform 0.2s, box-shadow 0.2s"
            }}
            onMouseEnter={(e) => {
              if (playerName.trim()) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 16px rgba(102,126,234,0.4)";
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🎮 Create New Lobby
          </button>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "24px 0",
              color: "#999"
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
            <span style={{ padding: "0 16px", fontSize: "0.9em" }}>OR</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#e0e0e0" }} />
          </div>

          {/* Join Lobby Section */}
          {!showJoinForm ? (
            <button
              onClick={() => setShowJoinForm(true)}
              disabled={!playerName.trim()}
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "1.1em",
                fontWeight: "600",
                color: playerName.trim() ? "#667eea" : "#999",
                backgroundColor: "#f5f5f5",
                border: "2px solid " + (playerName.trim() ? "#667eea" : "#e0e0e0"),
                borderRadius: 8,
                cursor: playerName.trim() ? "pointer" : "not-allowed",
                transition: "all 0.2s"
              }}
            >
              🔗 Join Existing Lobby
            </button>
          ) : (
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontWeight: "600",
                  color: "#333"
                }}
              >
                Lobby Code
              </label>
              <input
                type="text"
                value={lobbyCode}
                onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                placeholder="Enter 6-digit code"
                maxLength={6}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "1.2em",
                  border: "2px solid #e0e0e0",
                  borderRadius: 8,
                  outline: "none",
                  textAlign: "center",
                  letterSpacing: "0.2em",
                  fontWeight: "bold",
                  marginBottom: 12,
                  boxSizing: "border-box"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
              <button
                onClick={handleJoinLobby}
                disabled={!playerName.trim() || !lobbyCode.trim()}
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "1.1em",
                  fontWeight: "600",
                  color: "#fff",
                  background:
                    playerName.trim() && lobbyCode.trim()
                      ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                      : "#ccc",
                  border: "none",
                  borderRadius: 8,
                  cursor:
                    playerName.trim() && lobbyCode.trim() ? "pointer" : "not-allowed"
                }}
              >
                Join Game
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // In Lobby: Waiting for players
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20
      }}
    >
      <div
        style={{
          maxWidth: 600,
          width: "100%",
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
            padding: 32,
            color: "#fff",
            textAlign: "center"
          }}
        >
          <h2 style={{ margin: "0 0 12px 0", fontSize: "2em" }}>
            🦅 Game Lobby
          </h2>
          <div
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.2)",
              padding: "8px 24px",
              borderRadius: 24,
              fontSize: "1.2em",
              fontWeight: "bold",
              letterSpacing: "0.3em"
            }}
          >
            {lobby.id}
          </div>
          <p style={{ margin: "12px 0 0 0", opacity: 0.9, fontSize: "0.9em" }}>
            Share this code with your friends
          </p>
        </div>

        {/* Players List */}
        <div style={{ padding: 32 }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#333" }}>
            Players ({lobby.players.length}/5)
          </h3>
          <div style={{ marginBottom: 24 }}>
            {lobby.players.map((player, idx) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 16,
                  marginBottom: 8,
                  backgroundColor: idx === 0 ? "#f0f4ff" : "#f9f9f9",
                  borderRadius: 8,
                  border: idx === 0 ? "2px solid #667eea" : "2px solid #e0e0e0"
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `hsl(${idx * 60}, 70%, 60%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2em",
                    marginRight: 16
                  }}
                >
                  {player.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "600", color: "#333" }}>
                    {player.name}
                  </div>
                  {idx === 0 && (
                    <div style={{ fontSize: "0.85em", color: "#667eea" }}>
                      👑 Host
                    </div>
                  )}
                </div>
                {player.id === socket.id && (
                  <div
                    style={{
                      padding: "4px 12px",
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      borderRadius: 12,
                      fontSize: "0.85em",
                      fontWeight: "600"
                    }}
                  >
                    You
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Game Info */}
          <div
            style={{
              padding: 16,
              backgroundColor: "#fffbea",
              borderRadius: 8,
              border: "2px solid #ffd700",
              marginBottom: 24
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>
              ℹ️ Game Information
            </h4>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#666" }}>
              <li>Players: 2-5</li>
              <li>Duration: ~60-90 minutes</li>
              <li>4 Rounds per game</li>
              <li>Turn-based strategy</li>
            </ul>
          </div>

          {/* Start/Wait Button */}
          {isHost ? (
            <button
              onClick={handleStartGame}
              disabled={!canStart}
              style={{
                width: "100%",
                padding: "16px",
                fontSize: "1.2em",
                fontWeight: "600",
                color: "#fff",
                background: canStart
                  ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                  : "#ccc",
                border: "none",
                borderRadius: 8,
                cursor: canStart ? "pointer" : "not-allowed",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => {
                if (canStart) e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
              }}
            >
              {canStart ? "🚀 Start Game" : "⏳ Waiting for more players..."}
            </button>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: 16,
                color: "#666",
                fontSize: "1.1em"
              }}
            >
              ⏳ Waiting for host to start the game...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
