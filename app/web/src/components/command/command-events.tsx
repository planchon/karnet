import { Dialog, DialogContent, DialogFooter } from "@/primitive/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/primitive/ui/select";
import { IconCalendar, IconChevronRight, IconLabel } from "@tabler/icons-react";
import { useShortcut } from "@/hooks/useShortcut";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/primitive/ui/tooltip";
import { Button } from "@/primitive/ui/button";
import { Switch } from "@/primitive/ui/switch";
import { DateTimePicker } from "../../primitive/super-ui/date-time-picker";
import { useCommands } from "@/hooks/useShortcut";
import { observer } from "mobx-react";
import usePreventAutoFocus from "@/hooks/usePreventAutoFocus";

export const CreateEventCommand = observer(function CreateEventCommand() {
  const commands = useCommands();

  const preventAutoFocus = usePreventAutoFocus();

  useShortcut("c+e", () => {
    commands.toggleEvent();
  });

  return (
    <Dialog open={commands.eventOpen} onOpenChange={commands.toggleEvent}>
      <DialogContent className="min-w-[700px] p-0" {...preventAutoFocus}>
        <div className="flex w-full flex-col gap-3 p-3 pb-0">
          <div className="flex items-center gap-2">
            <CalendarSelect tabIndex={1} />
            <IconChevronRight className="size-3" />
            <span className="font-regular text-xs">New event</span>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Event name"
              autoFocus
              tabIndex={2}
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled min-h-[20px] w-full resize-none bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex w-full select-none flex-row gap-2 pt-3">
            <div>
              <DateTimePicker tabIndex={3} />
            </div>
          </div>
        </div>
        <div className="w-full border-b" />
        <DialogFooter className="px-3 pb-3">
          <div className="flex select-none items-center gap-2">
            <Switch tabIndex={4} />
            <span className="text-xs">Create more</span>
          </div>
          <Button tabIndex={5}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

const CalendarSelect = observer(function CalendarSelect({
  tabIndex
}: {
  tabIndex: number;
}) {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger
            showChevron={false}
            size="sm"
            className="border shadow-none"
            tabIndex={tabIndex}
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
          Select the calendar
        </span>
      </TooltipContent>
    </Tooltip>
  );
});

const Deadline = observer(function Deadline() {
  return (
    <Tooltip delayDuration={800}>
      <TooltipTrigger autoFocus={false}>
        <Select>
          <SelectTrigger showChevron={false} size="sm" className="w-8 pl-[7px]">
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
