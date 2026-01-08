import { useState } from "react";

export function Tooltip({ children, text, position = "top" }) {
  const [visible, setVisible] = useState(false);

  const positions = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%) translateY(-8px)" },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%) translateY(8px)" },
    left: { right: "100%", top: "50%", transform: "translateY(-50%) translateX(-8px)" },
    right: { left: "100%", top: "50%", transform: "translateY(-50%) translateX(8px)" }
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          style={{
            position: "absolute",
            ...positions[position],
            backgroundColor: "#333",
            color: "white",
            padding: "8px 12px",
            borderRadius: 4,
            fontSize: "0.85em",
            whiteSpace: "nowrap",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
        >
          {text}
          <div
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              borderStyle: "solid",
              ...(position === "top" && {
                bottom: -6,
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "6px 6px 0 6px",
                borderColor: "#333 transparent transparent transparent"
              }),
              ...(position === "bottom" && {
                top: -6,
                left: "50%",
                transform: "translateX(-50%)",
                borderWidth: "0 6px 6px 6px",
                borderColor: "transparent transparent #333 transparent"
              }),
              ...(position === "left" && {
                right: -6,
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "6px 0 6px 6px",
                borderColor: "transparent transparent transparent #333"
              }),
              ...(position === "right" && {
                left: -6,
                top: "50%",
                transform: "translateY(-50%)",
                borderWidth: "6px 6px 6px 0",
                borderColor: "transparent #333 transparent transparent"
              })
            }}
          />
        </div>
      )}
    </div>
  );
}
