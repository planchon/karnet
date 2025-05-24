import React from "react";
import { Tldraw, TLUiComponents } from "tldraw";
import "tldraw/tldraw.css";

const components: TLUiComponents = {
  MenuPanel: null
};

function Draw() {
  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw components={components} />
    </div>
  );
}

export { Draw };
