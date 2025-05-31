import { Tldraw, TLUiComponents } from "tldraw";
import "tldraw/tldraw.css";

const components: TLUiComponents = {
  MenuPanel: null
};

function Draw() {
  return (
    <div className="h-full w-full">
      <Tldraw components={components} />
    </div>
  );
}

export { Draw };
