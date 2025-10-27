"use client";

import { useClerk, useUser } from "@clerk/react-router";
import {
    IconBrain,
    IconDatabase,
    IconFileText,
    IconFileWord,
    IconHelp,
    IconListCheck,
    IconLogout,
    IconMessageCircle,
    IconReport,
    IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { observer } from "mobx-react";
import type * as React from "react";
import { useLocation } from "react-router";
import { NavMain } from "@/components/navbar/nav-main";
import { useCommands } from "@/hooks/useCommand";
import { SuperLink } from "@/primitive/super-ui/link";
import { Sidebar, SidebarContent } from "@/primitive/ui/sidebar";
import { ChatSidebar } from "./chat-sidebar";
import { SidebarHeader, SidebarHeaderSettings } from "./nav-header";

export const AppSidebar = observer(function AppSidebarInner({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const commands = useCommands();
    const url = useLocation();
    const clerk = useClerk();

    const isSettings = url.pathname.startsWith("/settings");

    const data = {
        user: {
            name: "shadcn",
            email: "m@example.com",
            avatar: "/avatars/shadcn.jpg",
        },
        navMain: [
            // {
            //   title: "Agenda",
            //   url: "/agenda",
            //   icon: IconCalendar,
            //   tooltip: {
            //     title: "Go to agenda",
            //     side: "right" as const,
            //     shortcut: ["g", "a"]
            //   }
            // },
            {
                title: "Documents",
                url: "/document",
                icon: IconFileText,
                tooltip: {
                    title: "Go to documents",
                    side: "right" as const,
                    shortcut: ["g", "d"],
                },
            },
            {
                title: "Tasks",
                url: "/task",
                icon: IconListCheck,
                tooltip: {
                    title: "Go to tasks",
                    side: "right" as const,
                    shortcut: ["g", "t"],
                },
            },
            {
                title: "Chat",
                url: "/chat",
                icon: IconMessageCircle,
                tooltip: {
                    title: "Chat with an AI",
                    side: "right" as const,
                    shortcut: ["g", "c"],
                },
            },
        ],
        navSecondary: [
            {
                title: "Get Help",
                url: "#",
                icon: IconHelp,
                action: () => {
                    commands.toggleHelp();
                },
            },
        ],
        documents: [
            {
                name: "Data Library",
                url: "#",
                icon: IconDatabase,
            },
            {
                name: "Reports",
                url: "#",
                icon: IconReport,
            },
            {
                name: "Word Assistant",
                url: "#",
                icon: IconFileWord,
            },
        ],
    };

    const handleLogout = async () => {
        await clerk
            .signOut()
            .then(() => {
                window.location.href = "/";
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const { user } = useUser();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            {!isSettings && (
                <>
                    <SidebarHeader />
                    <SidebarContent>
                        <NavMain items={data.navMain} />
                        <div className="flex-1" />
                        <ChatSidebar />
                    </SidebarContent>
                </>
            )}
            {isSettings && (
                <SidebarContent>
                    <SidebarHeaderSettings />
                    <div className="h-[16px]" />
                    <SuperLink icon={IconBrain} title="Models" to="/settings/models" tooltip={{ title: "Models" }} />
                </SidebarContent>
            )}
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
