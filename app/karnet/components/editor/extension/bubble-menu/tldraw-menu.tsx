import { IconChevronDown } from "@tabler/icons-react";
import { type Editor, useEditorState } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import { Button } from "@ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { observer } from "mobx-react";
import { useCallback } from "react";
import { useStores } from "@/hooks/useStores";
import { cn, generateId } from "@/lib/utils";

export const SketchMenu = ({ editor }: { editor: Editor }) => {
	const { sketchesStore } = useStores();

	const state = useEditorState({
		editor,
		selector: (state) => {
			const selectedContent = state.editor.state.selection
				.content()
				.content.toJSON();

			if (selectedContent && selectedContent.length == 1) {
				const node = selectedContent[0];
				if (node.type === "tldraw") {
					return { id: node.attrs["id"] };
				}
			}

			return {};
		},
	});

	const shouldShow = useCallback(() => {
		return editor.isActive("tldraw");
	}, [editor]);

	return (
		<BubbleMenu
			editor={editor}
			shouldShow={shouldShow}
			updateDelay={0}
			pluginKey="tldrawMenu"
		>
			{state.id && (
				<div
					className={cn(
						"border-border bg-background w-fit rounded-lg border p-1 shadow",
					)}
				>
					<div className="flex flex-row items-center justify-center overflow-hidden rounded-md">
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									role="combobox"
									className="justify-between rounded-l-none"
								>
									<span className="max-w-[100px] truncate">
										{sketchesStore.getById(state.id)?.name}
									</span>
									<IconChevronDown />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="mt-2 rounded-md border p-0 shadow">
								<Command defaultValue={sketchesStore.getById(state.id)?.name}>
									<CommandInput placeholder="Search a sketch" />
									<CommandList className="mb-0">
										<CommandEmpty>No sketch found</CommandEmpty>
										<CommandGroup>
											{sketchesStore.allModels.map((sketch) => (
												<CommandItem
													key={sketch.name}
													value={sketch.name}
													onSelect={() => {
														const nodeUniqueId = generateId();
														editor
															.chain()
															.focus()
															.deleteCurrentNode()
															.insertContent(
																`<tldraw id="${sketch.id}" nodeUniqueId="${nodeUniqueId}"></tldraw>`,
															)
															.run();
													}}
												>
													{sketch.name}
												</CommandItem>
											))}
										</CommandGroup>
									</CommandList>
								</Command>
							</PopoverContent>
						</Popover>
					</div>
				</div>
			)}
		</BubbleMenu>
	);
};
