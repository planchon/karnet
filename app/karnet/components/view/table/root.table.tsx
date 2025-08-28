"use client";

import type { Doc } from "@karnet/backend/convex/_generated/dataModel";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { type Key, useEffect, useRef, useState } from "react";
import { useShortcut } from "@/hooks/useShortcut";
import { createContext } from "@/lib/create-context";
import { useSetFocusElement } from "@/lib/focus-manager";
import { slugify } from "@/lib/utils";
import type { AbstractView } from "@/view/abstract.view";
import { GenericView } from "@/view/generic.view";

const UP_KEYS = ["ArrowUp", "ArrowLeft", "k", "K"] satisfies Key[];
const DOWN_KEYS = ["ArrowDown", "ArrowRight", "j", "J"] satisfies Key[];
const ESCAPE_KEYS = ["Escape"] satisfies Key[];

const ViewContext = createContext<{
	viewModel: AbstractView<any>;
	data: Doc<"tasks">[];
	navigation: {
		mode: "keyboard" | "mouse" | "focus";
		setMode: (mode: "keyboard" | "mouse" | "focus") => void;
	};
}>("ViewContext");

export const ViewContextProvider = ViewContext[0];

export const useViewContext = ViewContext[1];

export const ViewRoot = observer(
	({ children, data }: { children: React.ReactNode; data: Doc<"tasks">[] }) => {
		const bodyRef = useRef<HTMLDivElement>(null);
		const router = useRouter();
		useSetFocusElement(bodyRef.current);

		const viewModel = new GenericView();
		viewModel.setItems(data);

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

		function tryCheckItem(forceTrue?: boolean) {
			const item = viewModel.currentItem();
			if (item) {
				viewModel.checkItem(item, forceTrue);
			}
		}

		function handleKeyDown(e: KeyboardEvent) {
			console.log("handle key down", e.key);

			setNavigationMode("keyboard");

			if (ESCAPE_KEYS.includes(e.key)) {
				resetFocus();
			}

			if (UP_KEYS.includes(e.key)) {
				if (e.metaKey || e.ctrlKey) {
					return;
				}

				viewModel.goUp();

				if (e.shiftKey) {
					tryCheckItem();
				}

				e.preventDefault();
				e.stopPropagation();
			}

			if (e.key === "x") {
				tryCheckItem();
			}

			if (DOWN_KEYS.includes(e.key)) {
				if (e.metaKey || e.ctrlKey) {
					return;
				}

				viewModel.goDown();

				if (e.shiftKey) {
					tryCheckItem();
				}

				e.preventDefault();
				e.stopPropagation();
			}

			if (e.key === "Enter") {
				const item = viewModel.currentItem();
				if (item) {
					router.push(`/${item.type}/${item.smallId}/${slugify(item.title)}`);
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
				ref={bodyRef} // make the div focusable (to be able to use the keyboard)
				tabIndex={-1}
			>
				<ViewContextProvider
					data={data}
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
