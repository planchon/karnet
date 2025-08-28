"use client";

import { api } from "@karnet/backend/convex/_generated/api";
import type { Doc } from "@karnet/backend/convex/_generated/dataModel";
import {
	IconAntennaBars2,
	IconAntennaBars3,
	IconAntennaBars4,
	IconAntennaBars5,
	IconCalendar,
	IconCalendarClock,
	IconCopy,
	IconId,
	IconPencil,
	IconPlus,
	IconTrash,
} from "@tabler/icons-react";
import {
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
} from "@ui/context-menu";
import { useMutation, usePaginatedQuery } from "convex/react";
import { observer } from "mobx-react";
import { View } from "@/components/view/table";
import { useCommands } from "@/hooks/useShortcut";
import { Priority } from "@/primitive/priority";
import { Label } from "@/primitive/super-ui/label";

export default observer(() => {
	const { results: tasks } = usePaginatedQuery(
		api.functions.task.getPaginatedTasks,
		{},
		{
			initialNumItems: 100,
		},
	);

	const updateTaskMutation = useMutation(api.functions.task.updateTask);

	const commands = useCommands();

	// const { viewStore } = useStores();
	// const view = viewStore.getTaskView();

	// useShortcut("v", () => {
	// 	const item = view.currentItem();

	// 	if (item instanceof TaskModel) {
	// 		switch (item.status) {
	// 			case "done":
	// 				item.setStatus("todo");
	// 				item.setCompleted();
	// 				break;
	// 			case "in_progress":
	// 				item.setStatus("done");
	// 				break;
	// 			case "todo":
	// 				item.setStatus("in_progress");
	// 				break;
	// 			default:
	// 				break;
	// 		}
	// 	}
	// });

	// useShortcut("f", () => {
	// 	const item = view.currentItem();
	// 	if (item instanceof TaskModel) {
	// 		let prio = item.priority;

	// 		if (!prio) {
	// 			item.setPriority(5);
	// 			return;
	// 		}

	// 		prio -= 1;
	// 		if (prio === 0) {
	// 			item.setPriority(5);
	// 			return;
	// 		}

	// 		item.setPriority(prio);
	// 	}
	// });

	return (
		<View.Root data={tasks}>
			<View.Header.Body>
				<View.Header.Title>Tasks</View.Header.Title>
				<View.Header.Spacer />
				<View.Header.Search />
			</View.Header.Body>
			<View.Items.Root>
				<View.Items.List>
					{(item: Doc<"tasks">) => (
						<View.Item.Line isLink={false}>
							<View.Item.Checkbox />
							<View.Item.Infos>
								<Priority priority={item.priority ?? 4} />
								<View.Item.Status />
								<View.Item.SmallId />
								{item.title && (
									<div className="font-medium text-accent-foreground text-sm">
										{item.title}
									</div>
								)}
							</View.Item.Infos>
							<View.Item.Spacer />
							<View.Item.Tags>
								{item.deadlineLabel && (
									<Label
										className="bg-background"
										icon={IconCalendar}
										label={item.deadlineLabel}
									/>
								)}
								<View.Item.Author />
								<View.Item.Date />
							</View.Item.Tags>
							<View.Item.ContextMenu>
								<ContextMenuItem>
									<IconPencil className="mr-2" />
									<span>Edit</span>
								</ContextMenuItem>
								<ContextMenuSeparator />
								<ContextMenuSub>
									<ContextMenuSubTrigger>
										<IconAntennaBars4 className="mr-4" />
										<span>Priority</span>
									</ContextMenuSubTrigger>
									<ContextMenuSubContent>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													priority: 1,
												});
											}}
										>
											<IconAntennaBars5 className="mr-2" />
											<span>Priority 1</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													priority: 2,
												});
											}}
										>
											<IconAntennaBars4 className="mr-2" />
											<span>Priority 2</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													priority: 3,
												});
											}}
										>
											<IconAntennaBars3 className="mr-2" />
											<span>Priority 3</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													priority: 4,
												});
											}}
										>
											<IconAntennaBars2 className="mr-2" />
											<span>Priority 4</span>
										</ContextMenuItem>
									</ContextMenuSubContent>
								</ContextMenuSub>
								<ContextMenuSub>
									<ContextMenuSubTrigger>
										<IconCalendar className="mr-4" />
										<span>Deadline</span>
									</ContextMenuSubTrigger>
									<ContextMenuSubContent>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													deadlineLabel: "Tomorrow",
												});
											}}
										>
											<IconCalendarClock className="mr-2" />
											<span>Tomorrow</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													deadlineLabel: "2 days",
												});
											}}
										>
											<IconCalendarClock className="mr-2" />
											<span>2 days</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													deadlineLabel: "End of week",
												});
											}}
										>
											<IconCalendarClock className="mr-2" />
											<span>End of week</span>
										</ContextMenuItem>
										<ContextMenuItem
											onSelect={() => {
												updateTaskMutation({
													id: item._id,
													deadlineLabel: "Next week",
												});
											}}
										>
											<IconCalendarClock className="mr-2" />
											<span>Next week</span>
										</ContextMenuItem>
									</ContextMenuSubContent>
								</ContextMenuSub>
								<ContextMenuSeparator />
								<ContextMenuSub>
									<ContextMenuSubTrigger>
										<IconCopy className="mr-4" />
										<span>Copy</span>
									</ContextMenuSubTrigger>
									<ContextMenuSubContent>
										<ContextMenuItem>
											<IconId className="mr-2" />
											<span>Copy ID</span>
											<ContextMenuShortcut>
												<span>⌘.</span>
											</ContextMenuShortcut>
										</ContextMenuItem>
									</ContextMenuSubContent>
								</ContextMenuSub>
								<ContextMenuSeparator />
								<ContextMenuItem>
									<IconTrash className="mr-2 text-destructive" />
									<span className="text-destructive">Delete</span>
								</ContextMenuItem>
							</View.Item.ContextMenu>
						</View.Item.Line>
					)}
				</View.Items.List>
				<View.Items.Menu>
					<ContextMenuItem
						onSelect={() => {
							commands.toggleTask();
						}}
					>
						<IconPlus className="mr-4" />
						New task
					</ContextMenuItem>
				</View.Items.Menu>
			</View.Items.Root>
		</View.Root>
	);
});
