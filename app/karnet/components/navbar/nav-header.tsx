"use client";

import { IconSearch } from "@tabler/icons-react";
import { useCommands } from "@/hooks/useShortcut";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";

function SidebarHeaderContainer({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-header"
			data-sidebar="header"
			className={cn(
				"flex flex-row items-center justify-between gap-2 p-2 pr-1",
				className,
			)}
			{...props}
		/>
	);
}

function SidebarHeaderLogo({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-menu-logo"
			data-sidebar="menu-logo"
			className={cn("flex w-full items-center gap-2", className)}
			{...props}
		/>
	);
}

function SidebarHeaderAction({
	className,
	...props
}: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="sidebar-menu-action"
			data-sidebar="menu-action"
			className={cn(
				"flex w-full flex-row items-center justify-end gap-2",
				className,
			)}
			{...props}
		/>
	);
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
	const commands = useCommands();

	return (
		<SidebarHeaderContainer className={className} {...props}>
			<SidebarHeaderLogo>
				<img
					src="https://avatars.githubusercontent.com/u/129000276"
					alt="karnet"
					className="size-5 select-none rounded-[4px]"
				/>
				<span className="text-sm font-medium">karnet</span>
			</SidebarHeaderLogo>
			<SidebarHeaderAction>
				<Button
					variant="ghost"
					size="icon"
					className="size-6"
					onClick={commands.toggleCommandK}
				>
					<IconSearch />
				</Button>
			</SidebarHeaderAction>
		</SidebarHeaderContainer>
	);
}

export { SidebarHeader, SidebarHeaderLogo, SidebarHeaderAction };
