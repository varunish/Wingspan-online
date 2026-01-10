import React, { useMemo, useState } from "react";
import { socket } from "../network/socket.js";
import { useToast } from "../hooks/useToast.js";
import { ToastContainer } from "../components/Toast.jsx";
import { Tooltip } from "../components/Tooltip.jsx";
import { FoodConverter } from "./FoodConverter.jsx";
import { FoodToken } from "../components/FoodToken.jsx";
import {
  validateGainFood,
  validatePlayBird,
  validateLayEggs,
  validateDrawCards
} from "../utils/actionValidation.js";
import "./ActionPanel.css";

export function ActionPanel({ state, myPlayerId }) {
  const me = state.players.find(p => p.id === myPlayerId);
  const isMyTurn =
    state.turn?.activePlayerId && me?.id === state.turn.activePlayerId;

  const { toasts, removeToast, showError, showWarning, showSuccess, showInfo } = useToast();

  // Listen for server responses
  React.useEffect(() => {
    const handleActionError = ({ error }) => {
      showError(error);
    };

    const handleActionSuccess = ({ message }) => {
      showSuccess(message);
    };

    const handlePowerActivated = ({ playerName, birdName, message }) => {
      showInfo(message);
    };

    socket.on("actionError", handleActionError);
    socket.on("actionSuccess", handleActionSuccess);
    socket.on("powerActivated", handlePowerActivated);

    return () => {
      socket.off("actionError", handleActionError);
      socket.off("actionSuccess", handleActionSuccess);
      socket.off("powerActivated", handlePowerActivated);
    };
  }, [showError, showSuccess, showInfo]);

  const forestStrength = (me?.habitats.forest.length ?? 0) + 1;
  const grassStrength = (me?.habitats.grassland.length ?? 0) + 1;
  const wetlandStrength = (me?.habitats.wetlands.length ?? 0) + 1;

  const [foodSelection, setFoodSelection] = useState([]);
  const [playBirdSelection, setPlayBirdSelection] = useState({
    birdId: "",
    habitat: ""
  });
  const [wildFoodChoices, setWildFoodChoices] = useState([]); // Food selections for wild costs
  const [eggTargets, setEggTargets] = useState([]);
  const [drawCount, setDrawCount] = useState(wetlandStrength);
  const [drawMode, setDrawMode] = useState("deck"); // "deck" or "tray"
  const [selectedTrayBirds, setSelectedTrayBirds] = useState([]);
  const [showFoodConverter, setShowFoodConverter] = useState(false);

  const canAct = isMyTurn && (me?.actionCubes ?? 0) > 0;

  const availableBirds = useMemo(() => {
    if (!me) return [];
    return me.hand || [];
  }, [me]);

  const allBirdSlots = useMemo(() => {
    if (!me) return [];
    return [
      ...(me.habitats.forest || []),
      ...(me.habitats.grassland || []),
      ...(me.habitats.wetlands || [])
    ];
  }, [me]);

  function toggleFood(idx, food) {
    setFoodSelection(sel => {
      if (sel.length >= forestStrength && !sel.includes(food + ":" + idx)) {
        return sel;
      }
      const key = food + ":" + idx;
      return sel.includes(key)
        ? sel.filter(x => x !== key)
        : [...sel, key];
    });
  }

  function addEggTarget(birdId) {
    setEggTargets(list => {
      if (list.length >= grassStrength) return list;
      return [...list, birdId];
    });
  }

  function resetEggTargets() {
    setEggTargets([]);
  }

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {showFoodConverter && (
        <FoodConverter
          gameState={state}
          myPlayerId={myPlayerId}
          onClose={() => setShowFoodConverter(false)}
        />
      )}
      <div className="action-panel" data-highlight="ACTION_PANEL">
        <h3><span className="action-section-icon">⚡</span> Actions</h3>
        {!isMyTurn && <div className="waiting-message">⏳ Waiting for your turn…</div>}
        {isMyTurn && (
          <>
            <div className="action-cubes-header">
              <div className="action-cubes-count">
                <span>🎲 Action cubes:</span>
                <strong>{me?.actionCubes ?? 0}</strong>
              </div>
              <button
                onClick={() => setShowFoodConverter(true)}
                className="action-button action-button-small action-button-secondary"
              >
                🔄 Convert Food (2:1)
              </button>
            </div>

          {/* Gain Food */}
          <div className="action-section">
            <div className="action-section-header">
              <span className="action-section-icon">🌲</span>
              <Tooltip text="Select food from the dice tray equal to your forest strength (1 + number of birds in forest)">
                <span>Gain Food (Forest strength {forestStrength}) ℹ️</span>
              </Tooltip>
            </div>
            <div className="food-dice-grid">
              {(state.diceTray || []).map((f, idx) => (
                <div
                  key={idx}
                  className={`food-die ${foodSelection.includes(f + ":" + idx) ? 'selected' : ''}`}
                  onClick={() => !canAct ? null : toggleFood(idx, f)}
                  style={{ opacity: canAct ? 1 : 0.5, cursor: canAct ? 'pointer' : 'not-allowed' }}
                >
                  <FoodToken type={f} size={40} />
                </div>
              ))}
            </div>
            <div className="selection-counter">
              Selected: {foodSelection.length} / {forestStrength}
            </div>
            <button
              className="action-button"
              disabled={
                !canAct || foodSelection.length !== forestStrength
              }
              onClick={() => {
                const validation = validateGainFood(me, state);
                if (!validation.valid) {
                  showError(validation.error);
                  return;
                }
                if (validation.warning) {
                  showWarning(validation.warning);
                }
                
                const foods = foodSelection.map(item =>
                  item.split(":")[0]
                );
                socket.emit("gainFood", {
                  gameId: state.id,
                  habitat: "forest",
                  foodTypes: foods
                });
                setFoodSelection([]);
              }}
            >
              ✓ Confirm Gain Food
            </button>
          </div>

          {/* Lay Eggs */}
          <div className="action-section">
            <div className="action-section-header">
              <span className="action-section-icon">🥚</span>
              <Tooltip text="Lay eggs on your birds up to your grassland strength (1 + number of birds in grassland). Each bird has an egg capacity limit.">
                <span>Lay Eggs (Grassland strength {grassStrength}) ℹ️</span>
              </Tooltip>
            </div>
            <div className="bird-selection-grid">
              {allBirdSlots.map((b, idx) => (
                <button
                  key={b.instanceId || `${b.id}-${idx}`}
                  className="bird-select-button"
                  onClick={() => addEggTarget(b.id)}
                  disabled={!canAct || eggTargets.length >= grassStrength}
                >
                  + {b.name}
                </button>
              ))}
            </div>
            <div className="selection-counter">
              Selected: {eggTargets.length} / {grassStrength}
            </div>
            <button 
              className="action-button action-button-danger action-button-small" 
              onClick={resetEggTargets} 
              disabled={!eggTargets.length}
            >
              ✕ Clear Selection
            </button>
            <button
              className="action-button"
              disabled={
                !canAct || eggTargets.length !== grassStrength
              }
              onClick={() => {
                const validation = validateLayEggs(me, state, eggTargets);
                if (!validation.valid) {
                  showError(validation.error);
                  return;
                }
                
                socket.emit("layEggs", {
                  gameId: state.id,
                  habitat: "grassland",
                  birdIds: eggTargets
                });
                setEggTargets([]);
              }}
            >
              ✓ Confirm Lay Eggs
            </button>
          </div>

          {/* Draw Cards */}
          <div className="action-section">
            <div className="action-section-header">
              <span className="action-section-icon">💧</span>
              <Tooltip text="Draw cards from the deck or face-up tray equal to your wetlands strength (1 + number of birds in wetlands). Hand limit is 8 cards.">
                <span>Draw Cards (Wetlands strength {wetlandStrength}) ℹ️</span>
              </Tooltip>
            </div>
            
            {/* Draw mode selection */}
            <div className="draw-mode-toggle">
              <label>
                <input
                  type="radio"
                  value="deck"
                  checked={drawMode === "deck"}
                  onChange={(e) => {
                    setDrawMode(e.target.value);
                    setSelectedTrayBirds([]);
                  }}
                  disabled={!canAct}
                />
                {" "}📚 Draw from deck
              </label>
              <label>
                <input
                  type="radio"
                  value="tray"
                  checked={drawMode === "tray"}
                  onChange={(e) => {
                    setDrawMode(e.target.value);
                    setSelectedTrayBirds([]);
                  }}
                  disabled={!canAct}
                />
                {" "}🃏 Select from face-up tray
              </label>
            </div>

            {/* Face-up tray selection */}
            {drawMode === "tray" && (
              <div style={{ marginBottom: 12, padding: 8, border: "1px solid #ccc", borderRadius: 4 }}>
                <p style={{ fontSize: "0.9em", marginBottom: 8 }}>
                  Select up to {wetlandStrength} bird(s) from the tray (remaining will be drawn from deck):
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {/* Check both birdTray and faceUpBirds for compatibility */}
                  {((state.birdTray || state.faceUpBirds || []).filter(b => b).length > 0) ? (
                    (state.birdTray || state.faceUpBirds || []).map((bird, idx) =>
                      bird ? (
                        <div
                          key={bird.instanceId || `${bird.id}-${idx}`}
                          onClick={() => {
                            if (!canAct) return;
                            const birdIdentifier = bird.instanceId || bird.id;
                            if (selectedTrayBirds.includes(birdIdentifier)) {
                              setSelectedTrayBirds(selectedTrayBirds.filter(id => id !== birdIdentifier));
                            } else if (selectedTrayBirds.length < wetlandStrength) {
                              setSelectedTrayBirds([...selectedTrayBirds, birdIdentifier]);
                            }
                          }}
                          style={{
                            padding: 8,
                            border: selectedTrayBirds.includes(bird.instanceId || bird.id) ? "3px solid #4CAF50" : "2px solid #ccc",
                            borderRadius: 4,
                            backgroundColor: selectedTrayBirds.includes(bird.instanceId || bird.id) ? "#e8f5e9" : "#fff",
                            cursor: canAct ? "pointer" : "default",
                            minWidth: 100
                          }}
                        >
                          <div style={{ fontWeight: "bold", fontSize: "0.9em" }}>{bird.name}</div>
                          <div style={{ fontSize: "0.8em", color: "#666" }}>
                            {bird.points} pts • {bird.habitats?.[0] || ""}
                          </div>
                        </div>
                      ) : null
                    )
                  ) : (
                    <div style={{ color: "#999", fontSize: "0.9em" }}>No face-up birds available</div>
                  )}
                </div>
                <div style={{ marginTop: 8, fontSize: "0.9em" }}>
                  Selected: {selectedTrayBirds.length}/{wetlandStrength}
                </div>
              </div>
            )}

            <button
              disabled={!canAct}
              onClick={() => {
                const validation = validateDrawCards(me, state, wetlandStrength);
                if (!validation.valid) {
                  showError(validation.error);
                  return;
                }
                if (validation.warning) {
                  showWarning(validation.warning);
                }

                socket.emit("drawCards", {
                  gameId: state.id,
                  habitat: "wetlands",
                  count: wetlandStrength,
                  fromTray: drawMode === "tray" ? selectedTrayBirds : []
                });
                
                setSelectedTrayBirds([]);
              }}
            >
              Draw {wetlandStrength} Card(s)
            </button>
          </div>

          {/* Play Bird */}
          <div style={{ marginTop: 12 }}>
            <Tooltip text="Play a bird from your hand by paying its food cost. Birds beyond the first slot also cost eggs: Slot 1 (free), Slot 2-3 (1 egg each), Slot 4-5 (2 eggs each).">
              <strong>Play Bird ℹ️</strong>
            </Tooltip>
            <div>
              <select
                value={playBirdSelection.birdId}
                onChange={e => {
                  const bird = availableBirds.find(b => b.id === e.target.value);
                  setPlayBirdSelection({
                    birdId: e.target.value,
                    habitat: bird?.habitats?.[0] || ""
                  });
                  setWildFoodChoices([]); // Reset wild food choices when bird changes
                }}
                disabled={!canAct}
              >
                <option value="">Select bird</option>
                {availableBirds.map((b, idx) => (
                  <option key={b.instanceId || `${b.id}-${idx}`} value={b.id}>
                    {b.name} ({b.foodCost.map(f => f === 'wild' ? '⭐' : f).join(",")})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: 4 }}>
              <select
                value={playBirdSelection.habitat}
                onChange={e =>
                  setPlayBirdSelection(sel => ({
                    ...sel,
                    habitat: e.target.value
                  }))
                }
                disabled={!canAct || !playBirdSelection.birdId}
              >
                <option value="">Select habitat</option>
                {(availableBirds.find(
                  b => b.id === playBirdSelection.birdId
                )?.habitats || []).map(h => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Wild Food Selection UI */}
            {(() => {
              const selectedBird = availableBirds.find(b => b.id === playBirdSelection.birdId);
              const wildCount = (selectedBird?.foodCost || []).filter(f => f === 'wild').length;
              
              if (wildCount > 0 && me) {
                const availableFoodTypes = ['invertebrate', 'seed', 'fish', 'fruit', 'rodent']
                  .filter(f => (me.food[f] || 0) > 0);
                
                return (
                  <div style={{ marginTop: 8, padding: 8, backgroundColor: '#fffbea', borderRadius: 4, border: '2px solid #FFD700' }}>
                    <div style={{ fontSize: '0.9em', fontWeight: 'bold', marginBottom: 4 }}>
                      Choose {wildCount} food for ⭐ wild cost ({wildFoodChoices.length}/{wildCount} selected):
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {availableFoodTypes.map(foodType => (
                        <button
                          key={foodType}
                          style={{
                            padding: '4px 8px',
                            backgroundColor: wildFoodChoices.includes(foodType) ? '#4CAF50' : '#fff',
                            color: wildFoodChoices.includes(foodType) ? '#fff' : '#333',
                            border: '2px solid #ccc',
                            borderRadius: 4,
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            setWildFoodChoices(choices => {
                              if (choices.includes(foodType)) {
                                return choices.filter(f => f !== foodType);
                              } else if (choices.length < wildCount) {
                                return [...choices, foodType];
                              }
                              return choices;
                            });
                          }}
                        >
                          {foodType} ({me.food[foodType]})
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <button
              style={{ marginTop: 4 }}
              disabled={
                !canAct ||
                !playBirdSelection.birdId ||
                !playBirdSelection.habitat ||
                (() => {
                  const selectedBird = availableBirds.find(b => b.id === playBirdSelection.birdId);
                  const wildCount = (selectedBird?.foodCost || []).filter(f => f === 'wild').length;
                  return wildCount > 0 && wildFoodChoices.length !== wildCount;
                })()
              }
              onClick={() => {
                const validation = validatePlayBird(
                  me,
                  state,
                  playBirdSelection.birdId,
                  playBirdSelection.habitat
                );
                if (!validation.valid) {
                  showError(validation.error);
                  return;
                }
                if (validation.warning) {
                  showWarning(validation.warning);
                }
                
                socket.emit("playBird", {
                  gameId: state.id,
                  birdId: playBirdSelection.birdId,
                  habitat: playBirdSelection.habitat,
                  wildFoodChoices: wildFoodChoices // Send the player's choices
                });
                setPlayBirdSelection({ birdId: "", habitat: "" });
                setWildFoodChoices([]);
              }}
            >
              Play Bird
            </button>
          </div>
          </>
        )}
      </div>
    </>
  );
}
