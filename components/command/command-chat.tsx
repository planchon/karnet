"use client";

import { observer } from "mobx-react";
import { useCommands } from "@/hooks/useCommand";
import { Dialog, DialogContent } from "@/primitive/ui/dialog";

export const CommandChat = observer(function CommandChatInner() {
    const commands = useCommands();

    return (
        <Dialog onOpenChange={commands.toggleChat} open={commands.chatOpen}>
            <DialogContent className="z-1000 min-w-[700px] p-3">
                <div className="flex w-full flex-col gap-3">
                    <div className="flex items-center gap-2">test</div>
                </div>
            </DialogContent>
        </Dialog>
    );
});
