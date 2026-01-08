import React from "react";

export function HintBubble({ hint }) {
  return (
    <div className="hint">
      <strong>{hint.step}</strong>
      <p>{hint.message}</p>
    </div>
  );
}
