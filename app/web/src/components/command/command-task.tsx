import { useSnapshot } from "valtio";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { commandEventsStore, toggleCreateTaskEvents } from "@/stores/commands";
import { useShortcut } from "@/hooks/useShortcut";
import { Switch } from "../ui/switch";

export const CreateTaskCommand = () => {
  const open = useSnapshot(commandEventsStore).taskOpen;

  useShortcut("c+t", () => {
    toggleCreateTaskEvents();
  });

  return (
    <Dialog open={open} onOpenChange={toggleCreateTaskEvents}>
      <DialogContent className="z-[1000] min-w-[700px] p-0">
        <div className="flex w-full flex-col gap-3 p-3">
          <div className="flex items-center gap-2">
            <span className="font-regular text-xs">Create a new task</span>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Event name"
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled text-md min-h-[20px] w-full resize-none bg-transparent outline-none"
            />
            <input
              type="text"
              placeholder="Description"
              multiple={true}
              className="text-field-text-default placeholder:text-field-text-placeholder disabled:text-field-text-disabled w-full resize-none bg-transparent text-sm outline-none"
            />
          </div>
        </div>
        <div className="w-full border-b" />
        <DialogFooter className="px-3 pb-3">
          <div className="flex items-center gap-2">
            <Switch />
            <span className="text-xs">Create more</span>
          </div>
          <Button>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
