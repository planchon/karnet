import { observer } from "mobx-react";
import { useCommands } from "@/hooks/useShortcut";
import { Dialog, DialogContent } from "@/primitive/ui/dialog";

export const CommandChat = observer(function CommandChat() {
	const commands = useCommands();

	return (
		<Dialog open={commands.chatOpen} onOpenChange={commands.toggleChat}>
			<DialogContent className="z-1000 min-w-[700px] p-3">
				<div className="flex w-full flex-col gap-3">
					<div className="flex items-center gap-2">test</div>
				</div>
			</DialogContent>
		</Dialog>
	);
});
