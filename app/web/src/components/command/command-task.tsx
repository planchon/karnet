import { useSnapshot } from "valtio";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { commandEventsStore, toggleCreateTask } from "@/stores/commands";
import { useShortcut } from "@/hooks/useShortcut";
import { Switch } from "../ui/switch";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "../ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "../super-ui/select";
import {
  IconAntennaBars3,
  IconAntennaBars5,
  IconCalendar,
  IconChevronRight,
  IconLabel
} from "@tabler/icons-react";

export const CreateTaskCommand = () => {
  const open = useSnapshot(commandEventsStore).taskOpen;

  useShortcut("c+t", () => {
    toggleCreateTask();
  });

  return (
    <Dialog open={open} onOpenChange={toggleCreateTask}>
      <DialogContent className="z-[1000] min-w-[700px] p-0">
        <div className="flex w-full flex-col gap-3 p-3 pb-0">
          <div className="flex items-center gap-2">
            <ProjectSelect />
            <IconChevronRight className="text-accent-foreground/60 size-4" />
            <span className="font-regular select-none text-xs">
              Create a new task
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Task name"
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled text-md min-h-[20px] w-full resize-none bg-transparent outline-none"
            />
          </div>
          <div className="flex w-full select-none flex-row gap-2 pt-3">
            <TaskPriority />
            <Deadline />
            <TaskLabel />
          </div>
        </div>
        <div className="w-full border-b" />
        <DialogFooter className="px-3 pb-3">
          <div className="flex select-none items-center gap-2">
            <Switch />
            <span className="text-xs">Create more</span>
          </div>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProjectSelect = () => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger
            showChevron={false}
            size="sm"
            className="border shadow-none"
          >
            <IconLabel className="text-accent-foreground/60 size-4" />
            <span className="text-accent-foreground/60 text-xs font-medium">
              Stratumn
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
        <span className="text-xs font-medium text-gray-500">
          Select the project
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

const TaskLabel = () => {
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

const TaskPriority = () => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger showChevron={false} size="sm" className="w-7 pl-1">
            <IconAntennaBars5 className="text-accent-foreground/60 size-4" />
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
        <span className="text-xs font-medium text-gray-500">Task priority</span>
      </TooltipContent>
    </Tooltip>
  );
};

const Deadline = () => {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger showChevron={false} size="sm" className="w-7 pl-[5px]">
            <IconCalendar className="text-accent-foreground/60 size-4" />
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
        <span className="text-xs font-medium text-gray-500">Task deadline</span>
      </TooltipContent>
    </Tooltip>
  );
};
