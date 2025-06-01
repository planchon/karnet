import { useSnapshot } from "valtio";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { commandEventsStore, toggleCreateProject } from "@/stores/commands";
import { useShortcut } from "@/hooks/useShortcut";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "../ui/tooltip";
import { IconLabel } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "../super-ui/select";

export const CreateProjectCommand = () => {
  const open = useSnapshot(commandEventsStore).projectOpen;

  useShortcut("c+p", () => {
    toggleCreateProject();
  });

  return (
    <Dialog open={open} onOpenChange={toggleCreateProject}>
      <DialogContent className="z-[1000] min-w-[700px] p-0">
        <div className="flex h-full min-h-[200px] w-full flex-col gap-3 p-3 pb-0">
          <div className="flex items-center gap-2">
            <span className="font-regular text-xs">Create a new project</span>
          </div>
          <div className="flex h-full flex-col gap-3">
            <input
              autoFocus
              type="text"
              placeholder="Project name"
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled text-md min-h-[20px] w-full resize-none bg-transparent outline-none"
            />
            <textarea
              placeholder="Description of the project"
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled min-h-full w-full resize-none bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex w-full flex-row">
            <ProjectLabel />
          </div>
        </div>
        <div className="w-full border-b" />
        <DialogFooter className="px-3 pb-3">
          <div className="flex select-none items-center gap-2">
            <Switch />
            <span className="text-xs">Create more</span>
          </div>
          <Button size="sm">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProjectLabel = () => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger showChevron={false} size="sm">
            <IconLabel className="text-accent-foreground/60 size-4" />
            <span className="text-accent-foreground/60 text-xs font-medium">
              Tags
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">
              <IconLabel className="text-accent-foreground/80 size-4" />
              test
            </SelectItem>
            <SelectItem value="2">
              <IconLabel className="text-accent-foreground/80 size-4" />
              test
            </SelectItem>
          </SelectContent>
        </Select>
      </TooltipTrigger>
      <TooltipContent>
        <span className="text-xs font-medium text-gray-500">Project label</span>
      </TooltipContent>
    </Tooltip>
  );
};
