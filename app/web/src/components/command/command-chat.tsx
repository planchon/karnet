import { Dialog, DialogContent } from "../ui/dialog";
import { commandEventsStore, toggleCreateChat } from "@/stores/commands";
import { useSnapshot } from "valtio";
import { useShortcut } from "@/hooks/useShortcut";

export const CommandChat = () => {
  const open = useSnapshot(commandEventsStore).chatOpen;

  useShortcut("c+c", () => {
    toggleCreateChat();
  });

  return (
    <Dialog open={open} onOpenChange={toggleCreateChat}>
      <DialogContent className="z-[1000] min-w-[700px] p-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2">test</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
