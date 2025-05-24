import React from "react";
import { Tldraw } from "tldraw";
import "tldraw/tldraw.css";

function Draw() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw />
    </div>
  );
}

export { Draw };
