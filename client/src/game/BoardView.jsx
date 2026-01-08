import React from "react";
import { HabitatRow } from "./HabitatRow.jsx";

export function BoardView() {
  return (
    <div className="board">
      <HabitatRow name="Forest" id="FOREST_ROW" />
      <HabitatRow name="Grassland" id="GRASSLAND_ROW" />
      <HabitatRow name="Wetlands" id="WETLANDS_ROW" />
    </div>
  );
}
