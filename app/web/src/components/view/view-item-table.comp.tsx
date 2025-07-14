import type { IconProps } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { observer } from "mobx-react";
import React, { type JSX, type Key, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useShortcut } from "@/hooks/useShortcut";
import { useSettings } from "@/hooks/useStores";
import { createContext } from "@/lib/create-context";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "@/primitive/super-ui/tooltip-wrapper";
import type {
	AbstractView,
	ViewItem as ViewItemType,
} from "@/view/abstract.view";

const UP_KEYS = ["ArrowUp", "ArrowLeft", "k"] satisfies Key[];
const DOWN_KEYS = ["ArrowDown", "ArrowRight", "j"] satisfies Key[];
const ESCAPE_KEYS = ["Escape", "Enter"] satisfies Key[];

const ViewContext = createContext<{
	viewModel: AbstractView<any>;
	navigation: {
		mode: "keyboard" | "mouse" | "focus";
		setMode: (mode: "keyboard" | "mouse" | "focus") => void;
	};
}>("ViewContext");

const ViewContextProvider = ViewContext[0];

const useViewContext = ViewContext[1];

const ViewRoot = observer(
	<R extends ViewItemType, T extends AbstractView<R>>({
		children,
		viewModel,
	}: {
		children: React.ReactNode;
		viewModel: T;
	}) => {
		const bodyRef = useRef<HTMLDivElement>(null);
		const navigate = useNavigate();

		const [navigationMode, setNavigationMode] = useState<
			"keyboard" | "mouse" | "focus"
		>("mouse");

		function searchHandler(e: KeyboardEvent) {
			viewModel.searchInputRef?.current?.focus();
			viewModel.setSelectedIndex(-1);
			e.preventDefault();
			e.stopPropagation();
		}

		useShortcut("Command+f", searchHandler);
		useShortcut("Control+f", searchHandler);
		useShortcut("/", searchHandler);

		useShortcut("Escape", resetFocus);

		viewModel.bodyRef = bodyRef;

		function resetFocus() {
			viewModel.setSelectedIndex(-1);

			if (viewModel.searchInputRef?.current) {
				viewModel.searchInputRef.current.blur();
			} else {
				console.warn("no search input ref in table view");
			}

			if (viewModel.bodyRef?.current) {
				viewModel.bodyRef.current.focus();
			} else {
				console.warn("no body ref in table view");
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			setNavigationMode("keyboard");

			if (document.activeElement === viewModel.searchInputRef?.current) {
				if (ESCAPE_KEYS.includes(e.key)) {
					resetFocus();
				}
				return;
			}

			if (UP_KEYS.includes(e.key)) {
				viewModel.goUp();
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if (DOWN_KEYS.includes(e.key)) {
				viewModel.goDown();
				e.preventDefault();
				e.stopPropagation();
				return;
			}

			if (e.key === "Enter") {
				const item = viewModel.currentItem();
				if (item) {
					navigate(`/${item.type}/${item.id}`);
				}
			}
		}

		useEffect(() => {
			function handleMouseMove(e: MouseEvent) {
				setNavigationMode("mouse");
				viewModel.setLastHoveredElement(e.target as HTMLElement);
			}

			if (!bodyRef.current) {
				throw new Error("No body ref in table view");
			}

			bodyRef.current.focus();

			bodyRef.current.addEventListener("keydown", handleKeyDown, {
				capture: true,
			});

			document.addEventListener("mousemove", handleMouseMove);

			return () => {
				if (!bodyRef.current) {
					return;
				}

				bodyRef.current.removeEventListener("keydown", handleKeyDown, {
					capture: true,
				});

				document.removeEventListener("mousemove", handleMouseMove);
			};
		}, []);

		return (
			<div
				className="h-full w-full focus:outline-none"
				id="view-root"
				tabIndex={-1} // make the div focusable (to be able to use the keyboard)
				ref={bodyRef}
			>
				<ViewContextProvider
					navigation={{
						mode: navigationMode,
						setMode: setNavigationMode,
					}}
					viewModel={viewModel}
				>
					{children}
				</ViewContextProvider>
			</div>
		);
	},
);

const ViewBody = observer(
	<R extends ViewItemType>({
		children,
	}: {
		children: (item: R) => JSX.Element;
	}) => {
		const { viewModel } = useViewContext("ViewBody");

		const data = viewModel.getItems;

		return (
			<div className="flex flex-col overflow-y-auto" id="view-body">
				{data.map((item: R, index: number) => {
					return (
						<__ViewItem item={item} key={item.id} listIndex={index}>
							{children}
						</__ViewItem>
					);
				})}
				<div className="h-10 w-full" />
			</div>
		);
	},
);

const [LocalItemContextProvider, useLocalItemContext] = createContext<{
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

const ViewItemLine = observer(
	({
		className,
		children,
		...props
	}: {
		className?: string;
		children: React.ReactNode;
	}) => {
		const settings = useSettings();

		const { item, listIndex } = useLocalItemContext("ViewItemLine");
		const { viewModel, navigation } = useViewContext("ViewItemLine");

		const isSelected = listIndex === viewModel._selectedIndex;

		return (
			<Link
				id={`view-item-line-${item.id}`}
				className={cn(
					"flex h-10 w-full select-none items-center justify-between gap-x-2 px-5 py-2 focus:outline-none",
					navigation.mode === "mouse" &&
						"cursor-pointer hover:bg-accent-foreground/10",
					navigation.mode === "keyboard" &&
						isSelected &&
						"bg-accent-foreground/10",
					navigation.mode === "focus" &&
						isSelected &&
						"bg-accent-foreground/10",
					settings.disableLinks && "pointer-events-none select-none",
					className,
				)}
				data-document-id={item.id}
				data-list-index={listIndex}
				key={item.id}
				onFocus={() => {
					navigation.setMode("focus");
					viewModel.setSelectedIndex(listIndex);
				}}
				to={`/${item.type}/${item.id}`}
				{...props}
			>
				{children}
			</Link>
		);
	},
);

const ViewItemInfos = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-row items-center gap-3" id="view-item-infos">
			{children}
		</div>
	);
};

const ViewItemIcon = ({
	children,
}: {
	children: React.ReactElement<IconProps>;
}) => {
	return React.cloneElement(children, {
		className: "text-accent-foreground/80 size-4",
	});
};

const ViewItemSmallId = () => {
	const { item } = useLocalItemContext("ViewItemSmallId");

	return (
		<div
			className="w-16 font-normal text-accent-foreground/80 text-sm"
			id="view-item-small-id"
		>
			{item.smallId}
		</div>
	);
};

const ViewItemLabels = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="flex flex-row items-center gap-2" id="view-item-labels">
			{children}
		</div>
	);
};

const ViewItemDate = () => {
	return (
		<div className="text-[12px] text-accent-foreground/70" id="view-item-date">
			Mer 24.06
		</div>
	);
};

const ViewItemAuthor = () => {
	return (
		<div id="view-item-author">
			<Avatar className="size-5">
				<AvatarImage src="https://github.com/planchon.png" />
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
		</div>
	);
};

// HEADER COMPONENTS

const ViewHeaderBody = observer(
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

const ViewHeaderTitle = observer(
	({ children }: { children: React.ReactNode }) => {
		return (
			<span className="font-medium text-sm" id="view-header-title">
				{children}
			</span>
		);
	},
);

const ViewHeaderSpacer = () => {
	return <div className="flex-1" id="view-header-spacer" />;
};

const ViewHeaderSearch = observer(() => {
	const { viewModel } = useViewContext("ViewHeaderSearch");
	const searchInputRef = useRef<HTMLInputElement>(null);

	viewModel.searchInputRef = searchInputRef;

	return (
		<div
			className="flex h-6 w-40 items-center justify-between rounded-sm border pr-[3px] focus-within:border-1 focus-within:border-accent-foreground/50 focus-within:ring-3 focus-within:ring-accent-foreground/30"
			id="view-header-search"
		>
			<Input
				className="focus:!ring-0 h-6 w-full rounded-sm border-none text-xs shadow-none placeholder:text-xs focus:outline-none"
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

const ViewHeaderPossibilities = observer(
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

export const View = {
	Header: {
		Body: ViewHeaderBody,
		Title: ViewHeaderTitle,
		Spacer: ViewHeaderSpacer,
		Possibilities: ViewHeaderPossibilities,
		Search: ViewHeaderSearch,
	},
	Item: {
		Line: ViewItemLine,
		Infos: ViewItemInfos,
		Icon: ViewItemIcon,
		SmallId: ViewItemSmallId,
		Spacer: ViewHeaderSpacer,
		Labels: ViewItemLabels,
		Author: ViewItemAuthor,
		Date: ViewItemDate,
	},
	Root: ViewRoot,
	Body: ViewBody,
};
