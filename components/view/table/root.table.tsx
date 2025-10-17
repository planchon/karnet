"use client";

import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { type Key, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { createContext } from "@/lib/create-context";
import { useSetFocusElement } from "@/lib/focus-manager";
import { slugify } from "@/lib/utils";
import type { AbstractView } from "@/view/abstract.view";

const UP_KEYS = ["ArrowUp", "ArrowLeft", "k", "K"] satisfies Key[];
const DOWN_KEYS = ["ArrowDown", "ArrowRight", "j", "J"] satisfies Key[];
const ESCAPE_KEYS = ["Escape"] satisfies Key[];

const ViewContext = createContext<{
    viewModel: AbstractView<any>;
    navigation: {
        mode: "keyboard" | "mouse" | "focus";
        setMode: (mode: "keyboard" | "mouse" | "focus") => void;
    };
}>("ViewContext");

export const ViewContextProvider = ViewContext[0];

export const useViewContext = ViewContext[1];

export const ViewRoot = observer(
    ({ children, viewModel }: { children: React.ReactNode; viewModel: AbstractView<any> }) => {
        const bodyRef = useRef<HTMLDivElement>(null);
        const router = useRouter();
        useSetFocusElement(bodyRef.current);

        const [navigationMode, setNavigationMode] = useState<"keyboard" | "mouse" | "focus">("mouse");

        function searchHandler(e: KeyboardEvent) {
            viewModel.searchInputRef?.current?.focus();
            viewModel.setSelectedIndex(-1);
            e.preventDefault();
            e.stopPropagation();
        }

        useHotkeys("Command+f", searchHandler);
        useHotkeys("Control+f", searchHandler);
        useHotkeys("/", searchHandler);

        useHotkeys("Escape", resetFocus);

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
                // onKeyDown={handleKeyDown}
                tabIndex={-1}
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
    }
);
