import { SimpleEditor } from "@editor/editor/editor";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";
import { useStores } from "@/hooks/useStores";
import "@editor/styles/_variables.scss";
import "@editor/styles/_keyframe-animations.scss";

export const PaperPage = observer(function PaperPage() {
  const { id } = useParams();
  const { paperStore } = useStores();

  const paper = paperStore.getById(id);

  if (!id) {
    return <div>No id</div>;
  }

  return (
    <div className="h-full w-full">
      <div className="flex h-10 w-full items-center justify-between border-b">
        <div className="flex h-full w-full select-none flex-row items-center justify-center gap-2 pl-4">
          <Input
            className="w-full border-none font-medium focus:border-transparent focus:!ring-0"
            placeholder="Document name"
            value={paper.name}
            onChange={(e) => {
              paper.name = e.target.value;
            }}
          />
        </div>
        <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
          {/* <TooltipWrapper
            tooltip={{
              title: "Create a project",
              side: "left",
              shortcut: ["n"]
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => commands.toggleProject()}
            >
              <IconPlus className="size-3" />
              <span className="text-xs">New project</span>
            </Button>
          </TooltipWrapper> */}
          <Button variant="outline" size="sm">
            <IconAdjustmentsHorizontal className="size-3" />
            <span className="text-xs">Infos</span>
          </Button>
        </div>
      </div>
      <SimpleEditor key={id} id={id} />;
    </div>
  );
});
