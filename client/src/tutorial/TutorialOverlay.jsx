import React from "react";
import { HintBubble } from "./HintBubble.jsx";

export function TutorialOverlay({ hints }) {
  if (!hints) return null;

  return (
    <>
      {hints
        .filter(h => h.hint)
        .map(h => (
          <HintBubble
            key={h.playerId}
            hint={h.hint}
          />
        ))}
    </>
  );
}
