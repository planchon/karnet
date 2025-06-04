import {
  createTLStore,
  defaultShapeUtils,
  Editor,
  Tldraw,
  TLUiComponents,
  TLUiOverrides
} from "tldraw";
import { Grid } from "./grid";
import { Toolbar } from "./toolbar";
import "tldraw/tldraw.css";
import { useMemo } from "react";

const components: TLUiComponents & { Grid: typeof Grid } = {
  MenuPanel: null,
  Grid,
  Toolbar: Toolbar as TLUiComponents["Toolbar"]
};

type DrawProps = {
  id: string;
  callback: (editor: Editor) => void;
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

function Draw({ id, callback }: DrawProps) {
  const store = useMemo(() => {
    return createTLStore({
      persistenceKey: `p6n-${id}-draw`,
      shapeUtils: defaultShapeUtils
    });
  }, [id]);

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
          callback(e);
        }}
      />
    </div>
  );
}

export { Draw };
