import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:3000";

const p1 = io(SERVER_URL);
const p2 = io(SERVER_URL);

let gameId = null;
let alicePhase = "GAIN_FOOD";

function summarize(state) {
  return {
    players: state.players.map(p => p.name),
    activePlayerId: state.turn?.activePlayerId,
    logs: state.logs
  };
}

/* ===========================
   PLAYER 1 (ALICE)
=========================== */

p1.on("connect", () => {
  console.log("P1 connected:", p1.id);
  p1.emit("createGame", { playerName: "Alice" });
});

p1.on("gameCreated", ({ gameId: gid }) => {
  gameId = gid;
  console.log("Game created by P1:", gameId);
});

p1.on("stateUpdate", (state) => {
  console.log("STATE UPDATE (P1):", summarize(state));

  /* ---- ALWAYS CHECK GAME OVER ---- */
  if (state.gameOver) {
    console.log("FINAL SCORES:", state.finalScores);
    return;
  }

  const alice = state.players.find(p => p.name === "Alice");
  if (!state.turn || state.turn.activePlayerId !== alice.id) return;

  /* ---- PHASE 1: GAIN FOOD ---- */
  if (alicePhase === "GAIN_FOOD") {
    const food = state.diceTray[0];
    console.log("Alice gains food:", food);

    p1.emit("gainFood", {
      gameId,
      habitat: "forest",
      foodTypes: [food]
    });

    alicePhase = "PLAY_BIRD";
    return;
  }

  /* ---- PHASE 2: PLAY FIRST AVAILABLE BIRD ---- */
  if (alicePhase === "PLAY_BIRD") {
    if (!state._debug || !state._debug.aliceHand?.length) {
      console.log("No bird in Alice hand yet");
      return;
    }

    const birdId = state._debug.aliceHand[0];
    console.log("Alice plays bird:", birdId);

    p1.emit("playBird", {
      gameId,
      birdId,
      habitat: "forest"
    });

    alicePhase = "DONE";
  }
});

/* ===========================
   PLAYER 2 (BOB)
=========================== */

p2.on("connect", () => {
  console.log("P2 connected:", p2.id);
});

p2.on("gameCreated", ({ gameId: gid }) => {
  p2.emit("joinGame", {
    gameId: gid,
    playerName: "Bob"
  });
});

p2.on("stateUpdate", (state) => {
  console.log("STATE UPDATE (P2):", summarize(state));

  if (state.gameOver) return;

  const bob = state.players.find(p => p.name === "Bob");
  if (!state.turn || state.turn.activePlayerId !== bob.id) return;

  const food = state.diceTray[0];
  console.log("Bob gains food:", food);

  p2.emit("gainFood", {
    gameId,
    habitat: "forest",
    foodTypes: [food]
  });
});

/* ===========================
   ERROR HANDLING
=========================== */

p1.on("errorMessage", (msg) => {
  console.log("P1 ERROR:", msg);
});

p1.on("stateUpdate", (state) => {
  console.log("TUTORIAL HINTS (P1):", state.tutorialHints);
});


p2.on("errorMessage", (msg) => {
  console.log("P2 ERROR:", msg);
});
