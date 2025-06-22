import { SimpleEditor } from "@poltion/editor";
import "../../../../packages/editor/src/styles/_variables.scss";
import "../../../../packages/editor/src/styles/_keyframe-animations.scss";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStores } from "@/hooks/useStores";

export const FilePage = observer(function FilePage() {
  const { id } = useParams();
  const { documentStore } = useStores();

  const document = documentStore.getById(id);

  if (!id) {
    return <div>No id</div>;
  }

  return (
    <div className="h-full w-full">
      <div className="flex h-10 w-full items-center justify-between border-b">
        <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
          <Input
            className="w-full border-none font-medium focus:border-transparent focus:!ring-0"
            placeholder="Document name"
            value={document.name}
            onChange={(e) => {
              document.name = e.target.value;
            }}
          />
          <div className="flex flex-row items-center gap-2 pl-2">
            {/* <TooltipWrapper
              tooltip={{
                title: "All projects",
                side: "bottom",
                shortcut: ["1"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCloud className="size-3" />
                <span className="text-xs">Frame 1</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Brume filter",
                side: "bottom",
                shortcut: ["2"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCube className="size-3" />
                <span className="text-xs">Frame 2</span>
              </Button>
            </TooltipWrapper>
            <TooltipWrapper
              tooltip={{
                title: "Stratumn filter",
                side: "bottom",
                shortcut: ["3"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconBlocks className="size-3" />
                <span className="text-xs">Frame 3</span>
              </Button>
            </TooltipWrapper> */}
          </div>
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
