"use client";

import type { Icon } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/primitive/ui/sidebar";
import { SuperLink } from "../../primitive/super-ui/link";

export const NavMain = observer(function NavMainInner({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
		tooltip: {
			title: string;
			side?: "top" | "right" | "bottom" | "left";
			shortcut?: string[];
		};
	}[];
}) {
	const location = usePathname();
	const initialSelectedStartPosition =
		items.findIndex((item) => item.url === location) * 32 + 8;
	const [selectedStartPosition, setSelectedStartPosition] = useState(
		initialSelectedStartPosition,
	);

	useEffect(() => {
		setSelectedStartPosition(
			items.findIndex((item) => location.includes(item.url)) * 32 + 8,
		);
	}, [location, items]);

	return (
		<AnimatePresence>
			<SidebarGroup
				onMouseLeave={() => {
					setSelectedStartPosition(initialSelectedStartPosition);
				}}
			>
				<SidebarGroupContent className="flex flex-col gap-1 transition-all">
					<SidebarMenu>
						{selectedStartPosition !== -1 && (
							<motion.div
								animate={{
									x: 0,
									y: selectedStartPosition,
									width: "100%",
									height: 32,
									opacity: 1,
								}}
								className="absolute top-0 left-0 z-0 h-full w-full rounded-xs bg-accent-foreground/10"
								exit={{
									x: 0,
									y: selectedStartPosition,
									width: "100%",
									height: 32,
									opacity: 0,
								}}
								initial={{
									x: 0,
									y: selectedStartPosition,
									width: "100%",
									height: 32,
									opacity: 0,
								}}
								transition={{
									duration: 0.1,
									ease: "easeOut",
								}}
							/>
						)}
						{items.map((item, index) => (
							<SuperLink
								icon={item.icon}
								key={item.title}
								onMouseEnter={() => {
									setSelectedStartPosition(index * 32 + 8);
								}}
								title={item.title}
								href={item.url}
								tooltip={{
									title: item.tooltip.title,
									side: item.tooltip.side,
									shortcut: item.tooltip.shortcut,
								}}
							/>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</AnimatePresence>
	);
});
