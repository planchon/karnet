"use client";

import { observer } from "mobx-react";
import { usePageTitle } from "@/hooks/usePageTitle";

export default observer(() => {
    usePageTitle("My Documents - Karnet AI Assistant");
    // const { viewStore } = useStores();
    // const view = viewStore.getDocumentView();
    // const { paperStore, sketchesStore, diagramStore } = useStores();
    // const router = useRouter();

    return (
        <div className="flex h-full w-full flex-col items-center justify-center">
            <span className="select-none rounded-md border p-2 text-gray-500 text-sm shadow">Coming soon...</span>
        </div>
    );

    // return (
    // 	<View.Root viewModel={view}>
    // 		<View.Header.Body>
    // 			<View.Header.Title>Documents</View.Header.Title>
    // 			<View.Header.Spacer />
    // 			<View.Header.Search />
    // 		</View.Header.Body>
    // 		{/*<View.Items.Root>
    // 			<View.Items.List>
    // 				 {(item: PaperModel | SketchModel | DiagramModel) => (
    // 					<View.Item.Line>
    // 						<View.Item.Infos>
    // 							<View.Item.Icon>
    // 								{(() => {
    // 									switch (item.type) {
    // 										case "paper":
    // 											return <IconFile />;
    // 										case "sketch":
    // 											return <IconPalette />;
    // 										default:
    // 											return <IconChartDots3 />;
    // 									}
    // 								})()}
    // 							</View.Item.Icon>
    // 							<View.Item.SmallId />
    // 							{item.name && (
    // 								<div className="font-medium text-accent-foreground text-sm">
    // 									{item.name}
    // 								</div>
    // 							)}
    // 							{!item.name && (
    // 								<div className="font-medium text-destructive text-sm">
    // 									Untitled (please name me)
    // 								</div>
    // 							)}
    // 						</View.Item.Infos>
    // 						<View.Item.Spacer />
    // 						<View.Item.Tags>
    // 							<View.Item.Labels>
    // 								<Label
    // 									className="bg-background"
    // 									icon={IconCalendar}
    // 									label="test"
    // 								/>
    // 							</View.Item.Labels>
    // 							<View.Item.Author />
    // 							<View.Item.Date />
    // 						</View.Item.Tags>
    // 						<View.Item.ContextMenu>
    // 							<ContextMenuItem>
    // 								<IconPencil className="mr-2" />
    // 								<span>Rename</span>
    // 							</ContextMenuItem>
    // 							<ContextMenuItem>
    // 								<IconStar className="mr-2" />
    // 								<span>Favorite</span>
    // 							</ContextMenuItem>
    // 							<ContextMenuSeparator />
    // 							<ContextMenuSub>
    // 								<ContextMenuSubTrigger>
    // 									<IconCopy className="mr-4" />
    // 									<span>Copy</span>
    // 								</ContextMenuSubTrigger>
    // 								<ContextMenuSubContent>
    // 									<ContextMenuItem>
    // 										<IconId className="mr-2" />
    // 										<span>Copy ID</span>
    // 										<ContextMenuShortcut>
    // 											<span>⌘.</span>
    // 										</ContextMenuShortcut>
    // 									</ContextMenuItem>
    // 									<ContextMenuItem>
    // 										<IconLink className="mr-2" />
    // 										<span>Copy URL</span>
    // 										<ContextMenuShortcut>
    // 											<span>⌘L</span>
    // 										</ContextMenuShortcut>
    // 									</ContextMenuItem>
    // 								</ContextMenuSubContent>
    // 							</ContextMenuSub>
    // 							<ContextMenuSeparator />
    // 							<ContextMenuItem>
    // 								<IconTrash className="mr-2 text-destructive" />
    // 								<span className="text-destructive">Delete</span>
    // 							</ContextMenuItem>
    // 						</View.Item.ContextMenu>
    // 					</View.Item.Line>
    // 				)}
    // 			</View.Items.List>
    // 			<View.Items.Menu>
    // 				<ContextMenuSub>
    // 					<ContextMenuSubTrigger>
    // 						<IconPlus className="mr-4" />
    // 						Create
    // 					</ContextMenuSubTrigger>
    // 					<ContextMenuSubContent className="w-40">
    // 						<ContextMenuItem asChild>
    // 							<button
    // 								className="w-full"
    // 								onClick={() => {
    // 									const id = generateId();
    // 									const paper = paperStore.createModel(id);
    // 									router.push(`/paper/${paper.smallId}`);
    // 								}}
    // 								type="button"
    // 							>
    // 								<IconFile className="mr-4" />
    // 								Papers
    // 							</button>
    // 						</ContextMenuItem>
    // 						<ContextMenuItem asChild>
    // 							<button
    // 								className="w-full"
    // 								onClick={() => {
    // 									const id = generateId();
    // 									const diagram = diagramStore.createModel(id);
    // 									router.push(`/diagram/${diagram.smallId}`);
    // 								}}
    // 								type="button"
    // 							>
    // 								<IconChartDots3 className="mr-4" />
    // 								Diagram
    // 							</button>
    // 						</ContextMenuItem>
    // 						<ContextMenuItem asChild>
    // 							<button
    // 								className="w-full"
    // 								onClick={() => {
    // 									const id = generateId();
    // 									const sketch = sketchesStore.createModel(id);
    // 									router.push(`/sketch/${sketch.smallId}`);
    // 								}}
    // 								type="button"
    // 							>
    // 								<IconPalette className="mr-4" />
    // 								Sketch
    // 							</button>
    // 						</ContextMenuItem>
    // 					</ContextMenuSubContent>
    // 				</ContextMenuSub>
    // 			</View.Items.Menu>
    // 		</View.Items.Root>*/}
    // 	</View.Root>
    // );
});
