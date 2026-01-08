import { useEffect, useState } from "react";
import { socket } from "./network/socket.js";
import { LobbyScreen } from "./components/LobbyScreen.jsx";
import { GameShell } from "./game/GameShell.jsx";

export default function App() {
  const [myPlayerId, setMyPlayerId] = useState(null);
  const [lobby, setLobby] = useState(null);
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    const handleConnect = () => {
      setMyPlayerId(socket.id);
    };

    const handleLobbyUpdate = (lobby) => {
      setLobby(lobby);
    };

    const handleGameStarted = ({ state }) => {
      // Always use current socket.id to avoid stale closures
      setMyPlayerId(socket.id);
      setGameState(state);
      setLobby(null);
    };

    const handleStateUpdate = (state) => {
      setGameState(state);
    };

    socket.on("connect", handleConnect);
    socket.on("lobbyUpdate", handleLobbyUpdate);
    socket.on("gameStarted", handleGameStarted);
    socket.on("stateUpdate", handleStateUpdate);

    // Set initial socket ID if already connected
    if (socket.connected) {
      setMyPlayerId(socket.id);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobbyUpdate", handleLobbyUpdate);
      socket.off("gameStarted", handleGameStarted);
      socket.off("stateUpdate", handleStateUpdate);
    };
  }, []);

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
