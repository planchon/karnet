"use client";

import { IconChevronLeft, IconSearch } from "@tabler/icons-react";
import Image from "next/image";
import { useNavigate } from "react-router";
import { useCommands } from "@/hooks/useShortcut";
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
            <SidebarHeaderAction>
                <Button className="size-6" onClick={commands.toggleCommandK} size="icon" variant="ghost">
                    <IconSearch />
                </Button>
            </SidebarHeaderAction>
        </SidebarHeaderContainer>
    );
}

function SidebarHeaderSettings({ className, ...props }: React.ComponentProps<"div">) {
    const navigate = useNavigate();

    return (
        <SidebarHeaderContainer className={className} {...props}>
            <Button className="absolute top-2 left-1 pl-0" onClick={() => navigate("/")} variant="ghost">
                <IconChevronLeft className="size-4" />
                Back to app
            </Button>
        </SidebarHeaderContainer>
    );
}

export { SidebarHeader, SidebarHeaderLogo, SidebarHeaderAction, SidebarHeaderSettings };
