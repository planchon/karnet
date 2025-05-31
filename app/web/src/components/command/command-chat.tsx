import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { commandEventsStore, toggleChatEvents } from "@/stores/commands";
import { useSnapshot } from "valtio";
import { useShortcut } from "@/hooks/useShortcut";

export const CommandChat = () => {
  const open = useSnapshot(commandEventsStore).chatOpen;

  useShortcut("c+c", () => {
    console.log("c+c");
    toggleChatEvents();
  });

  return (
    <Dialog open={open} onOpenChange={toggleChatEvents}>
      <DialogContent className="z-[1000] min-w-[700px] p-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2">test</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
