import { useEffect, useState } from "react";
import { socket } from "./network/socket.js";
import { LobbyScreen } from "./components/LobbyScreen.jsx";
import { GameShell } from "./game/GameShell.jsx";

export default function App() {
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setMyPlayerId(socket.id);
      
      // Try to reconnect to previous game if session exists
      const savedLobbyId = localStorage.getItem("wingspan_lobbyId");
      const savedPlayerName = localStorage.getItem("wingspan_playerName");
      
      if (savedLobbyId && savedPlayerName && !gameState && !lobby) {
        setReconnecting(true);
        socket.emit("reconnectToGame", { 
          lobbyId: savedLobbyId, 
          playerName: savedPlayerName 
        });
      }
    };

    const handleLobbyUpdate = (lobby) => {
      setLobby(lobby);
    };

    const handleGameStarted = ({ state }) => {
      // Always use current socket.id to avoid stale closures
      setMyPlayerId(socket.id);
      setGameState(state);
      setLobby(null);
      
      // Save game session
      if (lobby) {
        localStorage.setItem("wingspan_lobbyId", lobby.id);
        const me = lobby.players.find(p => p.id === socket.id);
        if (me) {
          localStorage.setItem("wingspan_playerName", me.name);
        }
      }
    };

    const handleStateUpdate = (state) => {
      setGameState(state);
    };

    const handleReconnectSuccess = ({ state, message }) => {
      setReconnecting(false);
      setMyPlayerId(socket.id);
      setGameState(state);
      console.log(message);
    };

    const handleReconnectError = ({ error }) => {
      setReconnecting(false);
      // Clear invalid session data
      localStorage.removeItem("wingspan_lobbyId");
      localStorage.removeItem("wingspan_playerName");
      console.error("Reconnect failed:", error);
    };

    socket.on("connect", handleConnect);
    socket.on("lobbyUpdate", handleLobbyUpdate);
    socket.on("gameStarted", handleGameStarted);
    socket.on("stateUpdate", handleStateUpdate);
    socket.on("reconnectSuccess", handleReconnectSuccess);
    socket.on("reconnectError", handleReconnectError);

    // Set initial socket ID if already connected
    if (socket.connected) {
      setMyPlayerId(socket.id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobbyUpdate", handleLobbyUpdate);
      socket.off("gameStarted", handleGameStarted);
      socket.off("stateUpdate", handleStateUpdate);
      socket.off("reconnectSuccess", handleReconnectSuccess);
      socket.off("reconnectError", handleReconnectError);
    };
  }, []);

  // Show reconnecting screen
  if (reconnecting) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
        <h2>Reconnecting to game...</h2>
        <p style={{ opacity: 0.8 }}>Restoring your session</p>
      </div>
    );
  }

  // Show game if in progress
  if (gameState) {
    return (
      <GameShell
        state={gameState}
        myPlayerId={myPlayerId}
      />
    );
  }

  // Show lobby screen (handles both pre-lobby and in-lobby states)
  return (
    <LobbyScreen
      lobby={lobby}
      onStartGame={() => socket.emit("startGame", { lobbyId: lobby.id })}
    />
  );
}
