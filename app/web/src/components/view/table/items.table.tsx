import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from "@ui/context-menu";
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
							<div className="h-full w-full"></div>
						</ContextMenuTrigger>
						{menu}
					</ContextMenu>
				</div>
			</div>
		);
	},
);

export const ViewItemsList = observer(
	<R extends ViewItemType>({
		children,
	}: {
		children: (item: R) => JSX.Element;
	}) => {
		const { viewModel } = useViewContext("ViewBody");

		const data = viewModel.getItems;

		return (
			<div className="flex flex-col overflow-y-auto" id="view-items-list">
				{data.map((item: R, index: number) => {
					return (
						<__ViewItem item={item} key={item.id} listIndex={index}>
							{children}
						</__ViewItem>
					);
				})}
			</div>
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
