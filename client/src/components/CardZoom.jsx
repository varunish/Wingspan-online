import React, { useEffect, useState } from "react";

/**
 * CardZoom - Shows a large version of a card when Alt is held and mouse hovers over card
 * Usage: Wrap your card component with <CardZoom cardImagePath={...}>
 */
export function CardZoom({ children, cardImagePath, cardContent }) {
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        setIsAltPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      if (!e.altKey) {
        setIsAltPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const showZoom = isAltPressed && isHovering;

  // Calculate position for zoomed card (try to keep it on screen)
  const zoomWidth = 360;
  const zoomHeight = 500;
  const offset = 20;

  let zoomX = mousePos.x + offset;
  let zoomY = mousePos.y + offset;

  // Keep on screen
  if (zoomX + zoomWidth > window.innerWidth) {
    zoomX = mousePos.x - zoomWidth - offset;
  }
  if (zoomY + zoomHeight > window.innerHeight) {
    zoomY = window.innerHeight - zoomHeight - offset;
  }
  if (zoomX < 0) zoomX = offset;
  if (zoomY < 0) zoomY = offset;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>

      {showZoom && (
        <div
          style={{
            position: "fixed",
            left: zoomX,
            top: zoomY,
            width: zoomWidth,
            height: zoomHeight,
            zIndex: 10000,
            pointerEvents: "none",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.8)",
            border: "4px solid #FFD700",
            backgroundColor: "#000"
          }}
        >
          {cardImagePath ? (
            <img
              src={cardImagePath}
              alt="Card zoom"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain"
              }}
            />
          ) : (
            cardContent
          )}
        </div>
      )}
    </>
  );
}
