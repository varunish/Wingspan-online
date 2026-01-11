import React, { useState } from "react";
import { HabitatRow } from "./HabitatRow.jsx";
import { Tooltip } from "../components/Tooltip.jsx";
import { FoodTokenList } from "../components/FoodToken.jsx";
import { ActionCubeCounter } from "../components/ActionCube.jsx";
import { BirdCard } from "../components/BirdCard.jsx";
import "./game.css";

export function PlayerBoard({ player, compact = false }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!player) {
    return <div className="player-board">Loading player board…</div>;
  }

  const totalEggs = [
    ...player.habitats.forest,
    ...player.habitats.grassland,
    ...player.habitats.wetlands
  ].reduce((sum, b) => sum + (b.eggs || 0), 0);

  const roundCubes = [8, 7, 6, 5][0] || 8; // TODO: Get actual round from state

  return (
    <div
      className="player-board"
      style={{
        border: "3px solid #8B4513",
        borderRadius: 12,
        padding: compact ? 8 : 16,
        marginBottom: 16,
        backgroundColor: "#FDF6E3",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        backgroundImage: "linear-gradient(to bottom, #FDF6E3, #F5E6D3)",
        opacity: compact ? 0.85 : 1
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: compact ? 8 : 12 }}>
        <h2
          className="player-name"
          style={{ margin: 0, color: "#5D4037", fontSize: "1.2em" }}
        >
          {player.name} {compact ? "(opponent)" : ""}
        </h2>
        {compact && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              padding: "4px 12px",
              fontSize: "0.9em",
              backgroundColor: "#8B4513",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#6D3813"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#8B4513"}
          >
            {isCollapsed ? "▼ Show" : "▲ Hide"}
          </button>
        )}
      </div>

      {(!compact || !isCollapsed) && (
        <>
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              padding: 12,
              backgroundColor: "rgba(255,255,255,0.7)",
              borderRadius: 8,
              border: "1px solid #D7CCC8"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Tooltip text="Number of actions you can take this round">
                <strong style={{ fontSize: "0.85em", color: "#666" }}>Actions ℹ️:</strong>
              </Tooltip>
              <ActionCubeCounter count={player.actionCubes} maxCount={roundCubes} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Tooltip text="Food tokens you can spend to play birds">
                <strong style={{ fontSize: "0.85em", color: "#666" }}>Food ℹ️:</strong>
              </Tooltip>
              <FoodTokenList food={player.food} size={28} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <Tooltip text="Total eggs on all your birds. Eggs score 1 point each at game end.">
                <strong style={{ fontSize: "0.85em", color: "#666" }}>Eggs ℹ️:</strong>
              </Tooltip>
              <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                🥚 {totalEggs}
              </div>
            </div>
          </div>

          {!compact && (
            <div style={{ marginBottom: 12 }}>
              <strong style={{ display: "block", marginBottom: 8 }}>🃏 Hand ({(player.hand || []).length} cards):</strong>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: "auto", padding: 8, backgroundColor: "rgba(255,255,255,0.5)", borderRadius: 8 }}>
                {(player.hand || []).length > 0 ? (
                  player.hand.map((bird, idx) => (
                    <BirdCard
                      key={bird.instanceId || `${bird.id}-${idx}`}
                      bird={bird}
                      compact={false}
                    />
                  ))
                ) : (
                  <div style={{ color: "#999", fontSize: "0.9em" }}>No cards in hand</div>
                )}
              </div>
            </div>
          )}

          <HabitatRow
            title="Forest"
            subtitle="Gain Food"
            slots={5}
            birds={player.habitats.forest}
            habitat="forest"
          />

          <HabitatRow
            title="Grassland"
            subtitle="Lay Eggs"
            slots={5}
            birds={player.habitats.grassland}
            habitat="grassland"
          />

          <HabitatRow
            title="Wetlands"
            subtitle="Draw Cards"
            slots={5}
            birds={player.habitats.wetlands}
            habitat="wetlands"
          />
        </>
      )}
    </div>
  );
}
