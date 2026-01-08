import { Tooltip } from "../components/Tooltip.jsx";
import { BirdCard } from "../components/BirdCard.jsx";

const HABITAT_COLORS = {
  forest: "#2E7D32",
  grassland: "#F9A825",
  wetlands: "#1976D2"
};

// Official Wingspan board layout
// Each column shows: benefit at that strength level + optional exchange
const HABITAT_CONFIG = {
  forest: {
    name: "Gain Food",
    subtitle: "from birdfeeder",
    columns: [
      { benefit: "🍖", eggCost: 0, exchange: null },
      { benefit: "🍖", eggCost: 1, exchange: null },
      { benefit: "🍖", eggCost: 1, exchange: { icon: "🥚→🍖", tooltip: "Convert 1 egg to 2 food from supply" } },
      { benefit: "🍖🍖", eggCost: 2, exchange: null },
      { benefit: "🍖🍖", eggCost: 2, exchange: { icon: "🥚→🍖", tooltip: "Convert 1 egg to 2 food from supply" } }
    ]
  },
  grassland: {
    name: "Lay Eggs",
    subtitle: "on bird(s)",
    columns: [
      { benefit: "🥚🥚", eggCost: 0, exchange: null },
      { benefit: "🥚🥚", eggCost: 1, exchange: null },
      { benefit: "🥚🥚", eggCost: 1, exchange: { icon: "🍖→🥚", tooltip: "Pay 1 food to lay 1 extra egg on any bird" } },
      { benefit: "🥚🥚🥚", eggCost: 2, exchange: null },
      { benefit: "🥚🥚🥚", eggCost: 2, exchange: { icon: "🍖→🥚", tooltip: "Pay 1 food to lay 1 extra egg on any bird" } }
    ]
  },
  wetlands: {
    name: "Draw Bird Cards",
    subtitle: "",
    columns: [
      { benefit: "🃏", eggCost: 0, exchange: null },
      { benefit: "🃏", eggCost: 1, exchange: null },
      { benefit: "🃏", eggCost: 1, exchange: { icon: "🥚→🃏", tooltip: "Pay 1 egg to draw 1 extra card" } },
      { benefit: "🃏🃏", eggCost: 2, exchange: null },
      { benefit: "🃏🃏", eggCost: 2, exchange: { icon: "🥚→🃏", tooltip: "Pay 1 egg to draw 1 extra card" } }
    ]
  }
};

export function HabitatRow({ title, subtitle, slots, birds, habitat }) {
  const habitatColor = HABITAT_COLORS[habitat] || "#666";
  const config = HABITAT_CONFIG[habitat];
  if (!config) return null;

  return (
    <div
      style={{
        marginBottom: 12,
        border: "3px solid " + habitatColor,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      {/* Habitat title */}
      <div
        style={{
          backgroundColor: habitatColor,
          color: "#fff",
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div>
          <div style={{ fontSize: "1.1em", fontWeight: "bold" }}>
            {config.name}
          </div>
          {config.subtitle && (
            <div style={{ fontSize: "0.75em", opacity: 0.9 }}>
              {config.subtitle}
            </div>
          )}
        </div>
        <div style={{ fontSize: "0.8em", opacity: 0.9 }}>
          Then activate any brown powers in this row →
        </div>
      </div>

      {/* Column structure - matches official board */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FAFAFA"
        }}
      >
        {config.columns.map((col, i) => {
          const bird = birds[i];
          const isOccupied = !!bird;

          return (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: 140,
                borderRight: i < config.columns.length - 1 ? "2px solid " + habitatColor : "none",
                display: "flex",
                flexDirection: "column",
                backgroundColor: isOccupied ? "#fff" : "#f5f5f5"
              }}
            >
              {/* TOP: Benefit & Exchange (what you GET when using this column) */}
              <div
                style={{
                  backgroundColor: habitatColor,
                  color: "#fff",
                  padding: "12px 8px",
                  textAlign: "center",
                  minHeight: 70,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "2px solid " + habitatColor
                }}
              >
                <div style={{ fontSize: "1.5em", marginBottom: 4 }}>
                  {col.benefit}
                </div>
                {col.exchange && (
                  <Tooltip text={col.exchange.tooltip}>
                    <div
                      style={{
                        fontSize: "0.7em",
                        backgroundColor: "rgba(255,255,255,0.2)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        marginTop: 4,
                        cursor: "help"
                      }}
                    >
                      OR: {col.exchange.icon}
                    </div>
                  </Tooltip>
                )}
              </div>

              {/* MIDDLE: Bird slot - Full card view */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 8,
                  minHeight: 280
                }}
              >
                {bird ? (
                  <BirdCard bird={bird} compact={false} showEggs={true} />
                ) : (
                  <div
                    style={{
                      width: 180,
                      height: 250,
                      border: "2px dashed #ccc",
                      borderRadius: 6,
                      backgroundColor: "#fff",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontSize: "0.9em",
                      textAlign: "center",
                      padding: 4
                    }}
                  >
                    <div>Empty Slot</div>
                  </div>
                )}
              </div>

              {/* BOTTOM: Egg cost for PLAYING a bird here */}
              {col.eggCost > 0 && (
                <div
                  style={{
                    backgroundColor: "rgba(139,69,19,0.15)",
                    padding: "6px",
                    textAlign: "center",
                    borderTop: "1px solid #ddd",
                    fontSize: "0.75em",
                    color: "#5D4037"
                  }}
                >
                  <Tooltip text={`Playing a bird in this column costs ${col.eggCost} egg(s) from your supply`}>
                    <div>
                      <strong>Play Cost:</strong> 🥚×{col.eggCost}
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
