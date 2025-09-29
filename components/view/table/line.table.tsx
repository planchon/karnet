"use client";

import type { IconProps } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Checkbox } from "@ui/checkbox";
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@ui/context-menu";
import { observer } from "mobx-react";
import Link from "next/link";
import React from "react";
import { useSettings } from "@/hooks/useStores";
import { cn, slugify } from "@/lib/utils";
import { Status } from "@/primitive/status";
import { useLocalItemContext } from "./items.table";
import { useViewContext } from "./root.table";

export const ViewItemLine = observer(
    ({
        className,
        children,
        isLink = true,
        ...props
    }: {
        className?: string;
        children: React.ReactElement[];
        isLink?: boolean;
    }) => {
        const settings = useSettings();

        const { item, listIndex } = useLocalItemContext("ViewItemLine");
        const { viewModel, navigation } = useViewContext("ViewItemLine");

        const everythingElse = children.filter((c) => {
            if (c === null || c === undefined) {
                return false;
            }

            return c.type !== ViewItemContextMenu;
        });

        const contextMenu = children.filter((c) => c.type === ViewItemContextMenu);

        const Component = isLink ? Link : "div";

        return (
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <Component
                        className={cn(
                            "z-50 flex h-10 w-full select-none items-center justify-between py-2 pr-5 pl-3 focus:outline-none",
                            settings.disableLinks && "pointer-events-none select-none",
                            className
                        )}
                        data-document-id={item._id}
                        data-list-index={listIndex}
                        href={`/${item.type}/${item.smallId}/${slugify(item.title)}`}
                        id={`view-item-line-${item.smallId}`}
                        key={item._id}
                        onFocus={() => {
                            navigation.setMode("focus");
                            viewModel.setSelectedIndex(listIndex);
                        }}
                        onMouseEnter={() => {
                            if (navigation.mode === "mouse") {
                                viewModel.setSelectedIndex(listIndex);
                            }
                        }}
                        {...props}
                    >
                        {everythingElse}
                    </Component>
                </ContextMenuTrigger>
                {contextMenu}
            </ContextMenu>
        );
    }
);

export const ViewItemInfos = ({ children }: { children: React.ReactNode }) => (
    <div className="z-50 flex flex-row items-center gap-3 pl-1" id="view-item-infos">
        {children}
    </div>
);

export const ViewItemTags = ({ children }: { children: React.ReactNode }) => (
    <div className="z-50 flex flex-row items-center gap-3" id="view-item-tags">
        {children}
    </div>
);

export const ViewItemIcon = ({ children }: { children: React.ReactElement<IconProps> }) =>
    React.cloneElement(children, {
        className: "text-accent-foreground/80 size-4",
    });

export const ViewItemSmallId = () => {
    const { item } = useLocalItemContext("ViewItemSmallId");

    return (
        <div className="w-16 font-normal text-accent-foreground/80 text-sm" id="view-item-small-id">
            {item.smallId}
        </div>
    );
};

export const ViewItemLabels = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-row items-center gap-2" id="view-item-labels">
        {children}
    </div>
);

export const ViewItemDate = () => (
    <div className="text-[12px] text-accent-foreground/70" id="view-item-date">
        Mer 24.06
    </div>
);

export const ViewItemAuthor = () => (
    <div id="view-item-author">
        <Avatar className="size-5">
            <AvatarImage src="https://github.com/planchon.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    </div>
);

export const ViewItemContextMenu = observer(({ children }: { children: React.ReactNode }) => (
    <ContextMenuContent className="w-48 overflow-hidden">{children}</ContextMenuContent>
));

export const ViewItemCheckbox = observer(({ isChecked }: { isChecked: boolean }) => {
    const { item } = useLocalItemContext("ViewItemCheckbox");
    const { viewModel } = useViewContext("ViewItemCheckbox");

    return (
        <div
            className="group z-1000 flex size-8 items-center justify-center transition-all duration-300 hover:cursor-pointer"
            onClick={(e) => {
                viewModel.checkItem(item);
                e.stopPropagation();
            }}
        >
            <Checkbox checked={isChecked} className="size-4 group-hover:border-accent-foreground/50" />
        </div>
    );
});

export const ViewItemStatus = observer(() => {
    const { item } = useLocalItemContext("ViewItemStatus");

    if (!("status" in item)) {
        return null;
    }

    // @ts-expect-error
    return <Status status={item.status} />;
});
