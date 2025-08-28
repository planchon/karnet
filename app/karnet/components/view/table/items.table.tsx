"use client";

import type { Doc } from "@karnet/backend/convex/_generated/dataModel";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from "@ui/context-menu";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import type { JSX } from "react";
import { createContext } from "@/lib/create-context";
import type { ViewItem as ViewItemType } from "@/view/abstract.view";
import { useViewContext } from "./root.table";

export const ViewItemsRoot = observer(
	({
		children,
	}: {
		children: [
			React.ReactElement<typeof ViewItemsList>,
			React.ReactElement<typeof ViewItemsContextMenu>,
		];
	}) => {
		// find the component with id = view-items-list
		const list = children.filter((c) => {
			return c.type === ViewItemsList;
		});
		// find the component with id = view-item-context-menu
		const menu = children.filter((c) => {
			return c.type === ViewItemsContextMenu;
		});

		if (list.length !== 1) {
			throw new Error("ViewItemsRoot must have a ViewItemsList");
		}

		if (menu.length !== 1) {
			throw new Error("ViewItemsRoot must have a ViewItemContextMenu");
		}

		return (
			<div className="h-full w-full">
				<div className="flex flex-col overflow-y-auto" id="view-body">
					{list}
				</div>
				<div className="h-full w-full ">
					<ContextMenu>
						<ContextMenuTrigger>
							<div className="h-full w-full" />
						</ContextMenuTrigger>
						{menu}
					</ContextMenu>
				</div>
			</div>
		);
	},
);

export const ViewItemsList = observer(
	({ children }: { children: (item: Doc<"tasks">) => JSX.Element }) => {
		const { viewModel } = useViewContext("ViewBody");
		const data = viewModel.getItems;

		const selectedStartPosition = viewModel._selectedIndex * 40 + 39;

		return (
			<AnimatePresence initial={false}>
				<div className="flex flex-col overflow-y-auto" id="view-items-list">
					{selectedStartPosition !== -1 && (
						<motion.div
							animate={{
								x: 0,
								y: selectedStartPosition,
								height: 40,
								width: "100%",
								opacity: 1,
							}}
							className="absolute top-0 left-0 z-0 h-full w-full bg-accent-foreground/10"
							exit={{
								x: 0,
								y: selectedStartPosition,
								height: 40,
								width: "100%",
								opacity: 0,
							}}
							initial={{
								x: 0,
								y: selectedStartPosition,
								height: 40,
								width: "100%",
								opacity: 0,
							}}
							transition={{
								duration: 0.1,
								ease: "easeOut",
							}}
						/>
					)}
					{data.map((item: Doc<"tasks">, index: number) => {
						return (
							<motion.div
								animate={{
									opacity: 1,
								}}
								initial={{
									opacity: 0,
								}}
								key={item._id}
								transition={{
									duration: 0.15,
									delay: index * 0.025,
									ease: "easeOut",
								}}
							>
								<__ViewItem item={item} key={item._id} listIndex={index}>
									{children}
								</__ViewItem>
							</motion.div>
						);
					})}
				</div>
			</AnimatePresence>
		);
	},
);

export const ViewItemsContextMenu = observer(
	({ children }: { children: React.ReactNode }) => {
		return (
			<ContextMenuContent className="w-48 overflow-hidden">
				{children}
			</ContextMenuContent>
		);
	},
);

export const [LocalItemContextProvider, useLocalItemContext] = createContext<{
	item: ViewItemType;
	listIndex: number;
}>("ViewItemContext");

const __ViewItem = observer(
	<R extends ViewItemType>({
		item,
		listIndex,
		children,
	}: {
		item: R;
		listIndex: number;
		children: (item: R) => React.ReactNode;
	}) => {
		return (
			<LocalItemContextProvider item={item} listIndex={listIndex}>
				{children(item)}
			</LocalItemContextProvider>
		);
	},
);
