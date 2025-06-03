import { Tldraw, TLUiComponents } from "tldraw";
import "tldraw/tldraw.css";

const components: TLUiComponents = {
  MenuPanel: null
};

type DrawProps = {
  id: string;
};

function Draw({ id }: DrawProps) {
  return (
    <div className="h-full w-full">
      <Tldraw components={components} persistenceKey={`p6n-${id}-draw`} />
    </div>
  );
}

export { Draw };
