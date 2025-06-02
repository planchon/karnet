import { Dialog, DialogContent } from "../ui/dialog";
import { useShortcut } from "@/hooks/useShortcut";
import { useCommands } from "@/hooks/useShortcut";
import { observer } from "mobx-react";

export const CommandChat = observer(function CommandChat() {
  const commands = useCommands();

  useShortcut("c+c", () => {
    commands.toggleChat();
  });

  return (
    <Dialog open={commands.chatOpen} onOpenChange={commands.toggleChat}>
      <DialogContent className="z-[1000] min-w-[700px] p-3">
        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-2">test</div>
        </div>
      </DialogContent>
    </Dialog>
  );
});
