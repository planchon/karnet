import { TooltipWrapper } from "@/components/super-ui/tooltip-wrapper";
import { Button } from "@/components/ui/button";
import {
  Icon123,
  IconBlocks,
  IconCloud,
  IconCube,
  IconFile,
  IconPlus,
  IconSubtask,
  IconAdjustmentsHorizontal,
  IconCalendar
} from "@tabler/icons-react";
import { useCommands, useShortcut } from "@/hooks/useShortcut";
import { observer } from "mobx-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/super-ui/label";

export const ProjectPage = observer(function ProjectPage() {
  const commands = useCommands();

  useShortcut("n", () => {
    commands.toggleProject();
  });

  return (
    <div className="h-full w-full">
      <div className="flex h-10 w-full items-center justify-between border-b">
        <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
          <span className="text-sm font-medium">Projects</span>
          <div className="flex flex-row items-center gap-2 pl-2">
            <TooltipWrapper
              tooltip={{
                title: "All projects",
                side: "bottom",
                shortcut: ["1"]
              }}
            >
              <Button variant="outline" size="sm">
                <IconCloud className="size-3" />
                <span className="text-xs">All projects</span>
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
                <span className="text-xs">Brume</span>
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
                <span className="text-xs">Stratumn</span>
              </Button>
            </TooltipWrapper>
          </div>
        </div>
        <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
          <TooltipWrapper
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
          </TooltipWrapper>
          <Button variant="outline" size="sm">
            <IconAdjustmentsHorizontal className="size-3" />
            <span className="text-xs">Display</span>
          </Button>
        </div>
      </div>
      <div className="flex w-full flex-col">
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
        <ProjectRow />
      </div>
      {/* <div className="scrollbar-thin mr-3 flex h-[calc(100%-40px)] w-full flex-row gap-3 overflow-x-auto py-3 pl-3">
        <ProjectColumn />
        <ProjectColumn />
        <ProjectColumn />
      </div> */}
    </div>
  );
});

const ProjectRow = observer(function ProjectRow() {
  return (
    <div className="hover:bg-accent/50 flex h-10 w-full select-none items-center justify-between px-5">
      <div className="flex flex-row gap-3">
        <div className="text-accent-foreground/80 text-sm font-normal">
          PROJ-111
        </div>
        <div className="text-accent-foreground text-sm font-medium">
          Je suis un titre de project
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Label label="test" icon={IconCalendar} className="bg-background" />
        <div className="text-accent-foreground/70 text-[12px]">Mer 24.06</div>
        <div>
          <Avatar className="size-5">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
});

const ProjectColumn = observer(function ProjectColumn() {
  return (
    <div className="h-full w-[350px] min-w-[350px] max-w-[350px] overflow-hidden rounded-md border">
      <div className="from-accent/30 to-accent/10 h-full bg-gradient-to-b">
        <div className="flex flex-row items-center gap-3 p-3">
          <Icon123 className="size-6 rounded-sm border p-1" />
          <span className="text-sm font-semibold">Project name</span>
        </div>
        <div className="scrollbar-thin h-full overflow-y-auto">
          <div className="flex flex-col gap-3 px-3 py-1">
            <span className="text-sm font-medium text-gray-700">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </span>
          </div>
          <div className="w-full border-b py-2" />
          <div className="flex flex-col gap-3 p-3">
            <div className="flex flex-row items-center gap-2">
              <IconSubtask className="size-4 text-gray-700" />
              <span className="text-sm font-medium">Priority tasks</span>
            </div>
            <div className="bg-accent/30 h-[300px] w-full"></div>
          </div>
          <div className="w-full border-b" />
          <div className="flex flex-col gap-3 p-3">
            <div className="flex flex-row items-center gap-2">
              <IconFile className="size-4 text-gray-700" />
              <span className="text-sm font-medium">Latests documents</span>
            </div>
            <div className="bg-accent/30 h-[200px] w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
});
