import { Tldraw, TLUiComponents } from "tldraw";
import "tldraw/tldraw.css";

const components: TLUiComponents = {
  MenuPanel: null
};

function Draw() {
  return (
    <div style={{ position: "fixed", inset: 0 }} className="tldraw__editor">
      <Tldraw components={components} />
    </div>
  );
}

export { Draw };
