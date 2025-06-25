import { Dialog, DialogContent, DialogFooter } from "@/primitive/ui/dialog";
import { Button } from "@/primitive/ui/button";
import { useShortcut } from "@/hooks/useShortcut";
import { Switch } from "@/primitive/ui/switch";
import { Tooltip, TooltipContent } from "@/primitive/ui/tooltip";
import { TooltipTrigger } from "@/primitive/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "../../primitive/super-ui/select";
import {
  IconAntennaBars3,
  IconAntennaBars5,
  IconCalendar,
  IconChevronRight,
  IconLabel
} from "@tabler/icons-react";
import { useCommands } from "@/hooks/useShortcut";
import { observer } from "mobx-react";
import usePreventAutoFocus from "@/hooks/usePreventAutoFocus";

export const CreateTaskCommand = observer(function CreateTaskCommand() {
  const commands = useCommands();

  const preventAutoFocus = usePreventAutoFocus();

  useShortcut("c+t", () => {
    commands.toggleTask();
  });

  return (
    <Dialog open={commands.taskOpen} onOpenChange={commands.toggleTask}>
      <DialogContent className="min-w-[700px] p-0" {...preventAutoFocus}>
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
              tabIndex={2}
              autoFocus
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
            <Switch tabIndex={6} />
            <span className="text-xs">Create more</span>
          </div>
          <Button tabIndex={7}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const ProjectSelect = observer(function ProjectSelect() {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger
            showChevron={false}
            size="sm"
            className="border shadow-none"
            tabIndex={1}
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
});

const TaskLabel = observer(function TaskLabel() {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger showChevron={false} size="sm" tabIndex={5}>
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
});

const TaskPriority = observer(function TaskPriority() {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger
            showChevron={false}
            size="sm"
            className="w-7 pl-1"
            tabIndex={3}
          >
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
});

const Deadline = observer(function Deadline() {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger
            showChevron={false}
            size="sm"
            className="w-7 pl-[5px]"
            tabIndex={4}
          >
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
});
