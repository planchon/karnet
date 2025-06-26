import { useStores } from "@/hooks/useStores";
import { Draw } from "@draw/draw";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { useEffect } from "react";
import { useParams } from "react-router";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";
import { cn } from "@/lib/utils";
import { SketchModel } from "@/models/sketch.model";

const SketchHeader = observer(function SketchHeader({
  sketch
}: {
  sketch: SketchModel;
}) {
  return (
    <div className="flex h-10 w-full items-center justify-between border-b">
      <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
        <Input
          className={cn(
            "w-full border-none font-medium focus:border-transparent focus:!ring-0"
          )}
          placeholder="Drawing name"
          value={sketch.name}
          onChange={(e) => {
            sketch.setName(e.target.value);
          }}
        />
        <div className="flex flex-row items-center gap-2 pl-2"></div>
      </div>
      <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
        <Button variant="outline" size="sm">
          <IconAdjustmentsHorizontal className="size-3" />
          <span className="text-xs">Infos</span>
        </Button>
      </div>
    </div>
  );
});

export const DrawPage = observer(function DrawPage() {
  const { id } = useParams();
  const { commandStore, sketchesStore } = useStores();

  const sketch = sketchesStore.getById(id);

  useEffect(() => {
    return () => {
      commandStore.resetContextualCommands();
    };
  }, []);

  if (!id) {
    return <div>No id</div>;
  }

  return (
    <div className="h-full w-full">
      <SketchHeader sketch={sketch} />
      <div className="h-[calc(100%-40px)] w-full">
        <Draw
          id={id}
          callback={(editor) => {
            commandStore.setDrawCommands(editor);
          }}
        />
      </div>
    </div>
  );
});
