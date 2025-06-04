import { Tldraw, TLUiComponents } from "tldraw";
import { Grid } from "./grid";
import "tldraw/tldraw.css";

const components: TLUiComponents & { Grid: typeof Grid } = {
  MenuPanel: null,
  Grid
};

type DrawProps = {
  id: string;
};

function Draw({ id }: DrawProps) {
  return (
    <div className="h-full w-full">
      <Tldraw
        components={components}
        persistenceKey={`p6n-${id}-draw`}
        onMount={(e) => {
          e.updateInstanceState({
            isGridMode: true
          });
        }}
      />
    </div>
  );
}

export { Draw };
