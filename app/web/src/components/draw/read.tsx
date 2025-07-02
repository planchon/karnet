import { Tldraw, TLEditorSnapshot } from "tldraw";
import { useStores } from "@/hooks/useStores";

export function Read({ id }: { id: string }) {
  const { sketchesStore } = useStores();
  const sketch = sketchesStore.getById(id);

  if (!sketch) {
    return null;
  }

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-0 top-0 z-[12] h-full w-full" />
      <Tldraw
        className="z-10 h-full w-full"
        key={id}
        components={{
          MenuPanel: null,
          Grid: null,
          Toolbar: null,
          Minimap: null,
          ZoomMenu: null
        }}
        tools={[]}
        snapshot={sketch.getSnapshot() as TLEditorSnapshot}
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
