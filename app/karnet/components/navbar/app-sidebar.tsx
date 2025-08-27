"use client";

import { UserButton, UserProfile, useUser } from "@clerk/nextjs";
import {
	IconDatabase,
	IconFileText,
	IconFileWord,
	IconHelp,
	IconListCheck,
	IconMessageCircle,
	IconReport,
} from "@tabler/icons-react";
import { observer } from "mobx-react";
import type * as React from "react";
import { NavMain } from "@/components/navbar/nav-main";
import { useCommands } from "@/hooks/useShortcut";
import { Sidebar, SidebarContent } from "@/primitive/ui/sidebar";
import { SidebarHeader } from "./nav-header";

export const AppSidebar = observer(function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	const commands = useCommands();

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

	const { user } = useUser();

	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader />
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<div className="flex items-center justify-center">
				<div className="flex w-full flex-row items-center justify-between gap-4 p-2">
					<div className="flex flex-col select-none">
						<p className="text-sm font-medium">{user?.fullName}</p>
						<p className="text-xs text-muted-foreground">
							{user?.emailAddresses[0].emailAddress}
						</p>
					</div>
					<UserButton
						appearance={{
							elements: {
								avatarBox: {
									width: "32px",
									height: "32px",
								},
							},
						}}
					/>
				</div>
			</div>
		</Sidebar>
	);
});
