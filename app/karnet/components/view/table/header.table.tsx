"use client";

import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { observer } from "mobx-react";
import { useRef } from "react";
import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import { useViewContext } from "./root.table";

export const ViewHeaderBody = observer(
	({ children }: { children: React.ReactNode }) => {
		return (
			<div
				className="flex h-10 w-full items-center justify-between border-b"
				id="view-header-body"
			>
				<div className="flex h-full w-full select-none flex-row items-center justify-between gap-2 px-4">
					{children}
				</div>
			</div>
		);
	},
);

export const ViewHeaderTitle = observer(
	({ children }: { children: React.ReactNode }) => {
		return (
			<span className="font-medium text-sm" id="view-header-title">
				{children}
			</span>
		);
	},
);

export const ViewHeaderSpacer = () => {
	return <div className="flex-1" id="view-header-spacer" />;
};

export const ViewHeaderSearch = observer(() => {
	const { viewModel } = useViewContext("ViewHeaderSearch");
	const searchInputRef = useRef<HTMLInputElement>(null);

	viewModel.searchInputRef = searchInputRef;

	return (
		<div
			className="flex h-6 w-40 items-center justify-between rounded-sm border pr-[3px] focus-within:border focus-within:border-accent-foreground/50 focus-within:ring-3 focus-within:ring-accent-foreground/30"
			id="view-header-search"
		>
			<Input
				className="focus:ring-0! h-6 w-full rounded-sm border-none text-xs shadow-none placeholder:text-xs focus:outline-none"
				onChange={(e) => {
					viewModel.setSearchQuery(e.target.value);
				}}
				placeholder="Search"
				ref={searchInputRef}
				value={viewModel.query}
			/>
			<span className="flex aspect-square h-[18px] w-[18px] select-none items-center justify-center rounded-[4px] border text-center font-mono text-[12px] text-accent-foreground/50">
				/
			</span>
		</div>
	);
});

export const ViewHeaderPossibilities = observer(
	({
		name,
		shortcut,
		children,
	}: {
		name: string;
		shortcut: string[];
		children: React.ReactNode;
	}) => {
		return (
			<div
				className="flex flex-row items-center gap-2"
				id="view-header-possibilities"
			>
				<TooltipWrapper tooltip={{ title: name, side: "bottom", shortcut }}>
					<Button asDiv size="sm" variant="outline">
						{children}
					</Button>
				</TooltipWrapper>
			</div>
		);
	},
);
