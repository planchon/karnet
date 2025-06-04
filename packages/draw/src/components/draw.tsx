import { Tldraw, TLUiComponents, TLUiOverrides } from "tldraw";
import { Grid } from "./grid";
import { Toolbar } from "./toolbar";
import "tldraw/tldraw.css";

const components: TLUiComponents & { Grid: typeof Grid } = {
  MenuPanel: null,
  Grid,
  Toolbar: Toolbar as TLUiComponents["Toolbar"]
};

type DrawProps = {
  id: string;
};
const overrides: TLUiOverrides = {
  actions(editor, actions, helpers) {
    const newActions = {
      ...actions,
      "toggle-grid": {
        ...actions["toggle-grid"],
        kbd: "g"
      }
    };

    return newActions;
  }
};

function Draw({ id }: DrawProps) {
  return (
    <div className="h-full w-full">
      <Tldraw
        components={components}
        overrides={overrides}
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
