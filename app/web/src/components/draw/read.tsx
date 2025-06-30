import { Tldraw } from "tldraw";

export function Read({ id }: { id: string }) {
  return (
    <div className="h-full w-full">
      <Tldraw
        key={id}
        components={{
          MenuPanel: null,
          Grid: null,
          Toolbar: null,
          Minimap: null,
          ZoomMenu: null
        }}
        tools={[]}
        persistenceKey={`p6n-${id}-draw`}
        onMount={(e) => {
          e.updateInstanceState({
            isReadonly: true
          });
          e.zoomToFit();
          e.setCameraOptions({
            isLocked: true
          });
        }}
      />
    </div>
  );
}
