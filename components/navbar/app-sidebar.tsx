"use client";

import { useClerk, useUser } from "@clerk/react-router";
import { IconLogout } from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { observer } from "mobx-react";
import type * as React from "react";
import { Sidebar, SidebarContent } from "@/primitive/ui/sidebar";
import { SettingsDialog } from "../settings/settings";
import { ChatSidebar } from "./chat-sidebar";
import { SidebarHeader } from "./nav-header";
import { NewChatButton } from "./new-chat";

export const AppSidebar = observer(function AppSidebarInner({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const clerk = useClerk();

    const handleLogout = async () => {
        await clerk.signOut();
    };

    const { user } = useUser();

    return (
        <Sidebar
            collapsible="offcanvas"
            {...props}
            className="sticky top-[calc(var(--header-height)+1px)] z-30 hidden h-[calc(100svh)] overscroll-none bg-transparent lg:flex"
        >
            <SidebarHeader />
            <NewChatButton />
            <SidebarContent className="no-scrollbar overflow-x-hidden">
                <ChatSidebar />
            </SidebarContent>
            <SettingsDialog />
            <div className="flex items-center justify-center">
                <div className="flex w-full flex-row items-center justify-between gap-4 p-2">
                    <div className="flex select-none flex-col">
                        <p className="font-medium text-sm">{user?.fullName}</p>
                        <p className="text-muted-foreground text-xs">{user?.emailAddresses[0].emailAddress}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="h-8 w-8 cursor-pointer rounded-full">
                                <AvatarImage alt={user?.fullName ?? ""} src={user?.imageUrl ?? ""} />
                                <AvatarFallback className="rounded-lg">{user?.fullName}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                            side={"right"}
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            alt={clerk.user?.fullName ?? ""}
                                            src={clerk.user?.imageUrl ?? ""}
                                        />
                                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-medium">{clerk.user?.fullName ?? ""}</span>
                                        <span className="truncate text-muted-foreground text-xs">
                                            {clerk.user?.emailAddresses[0].emailAddress ?? ""}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <IconLogout />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </Sidebar>
    );
});
