"use client";

import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { Link } from "react-router";
import { useCommands } from "@/hooks/useCommand";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";

function SidebarHeaderContainer({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex flex-row items-center justify-between gap-2 p-2 pr-1", className)}
            data-sidebar="header"
            data-slot="sidebar-header"
            {...props}
        />
    );
}

function SidebarHeaderLogo({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex w-full items-center gap-2", className)}
            data-sidebar="menu-logo"
            data-slot="sidebar-menu-logo"
            {...props}
        />
    );
}

function SidebarHeaderAction({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            className={cn("flex w-full flex-row items-center justify-end gap-2", className)}
            data-sidebar="menu-action"
            data-slot="sidebar-menu-action"
            {...props}
        />
    );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
    const commands = useCommands();

    return (
        <SidebarHeaderContainer className={className} {...props}>
            <SidebarHeaderLogo>
                <Image
                    alt="karnet"
                    className="select-none rounded-[4px]"
                    height={20}
                    loading="eager"
                    priority
                    src="/new-logo.svg"
                    width={20}
                />
            </SidebarHeaderLogo>
            <SidebarHeaderAction className="gap-1">
                <Link className="size-6 p-1" to="/settings">
                    <HiOutlineCog6Tooth className="text-gray-500" />
                </Link>
                <Button
                    className="size-6 border bg-white shadow"
                    onClick={commands.toggleCommandK}
                    size="icon"
                    variant="ghost"
                >
                    <IconSearch />
                </Button>
            </SidebarHeaderAction>
        </SidebarHeaderContainer>
    );
}

function SidebarHeaderSettings({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <SidebarHeaderContainer className={className} {...props}>
            <Link
                className="absolute top-2 left-2 flex items-center gap-2 rounded-md p-2 text-sm hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
                to="/chat"
            >
                <IconChevronLeft className="size-4" />
                Back to app
            </Link>
        </SidebarHeaderContainer>
    );
}

export { SidebarHeader, SidebarHeaderLogo, SidebarHeaderAction, SidebarHeaderSettings };
