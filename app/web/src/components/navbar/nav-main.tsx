import type { Icon } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/primitive/ui/sidebar";
import { SuperLink } from "../../primitive/super-ui/link";

export const NavMain = observer(function NavMain({
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
	const location = useLocation();
	const initialSelectedStartPosition =
		items.findIndex((item) => item.url === location.pathname) * 32 + 8;
	const [selectedStartPosition, setSelectedStartPosition] = useState(
		initialSelectedStartPosition,
	);

	useEffect(() => {
		setSelectedStartPosition(
			items.findIndex((item) => item.url === location.pathname) * 32 + 8,
		);
	}, [location.pathname]);

	return (
		<AnimatePresence>
			<SidebarGroup>
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
								key={item.title}
								title={item.title}
								to={item.url}
								icon={item.icon}
								tooltip={{
									title: item.tooltip.title,
									side: item.tooltip.side,
									shortcut: item.tooltip.shortcut,
								}}
								onMouseEnter={() => {
									setSelectedStartPosition(index * 32 + 8);
								}}
							/>
						))}
					</SidebarMenu>
				</SidebarGroupContent>
			</SidebarGroup>
		</AnimatePresence>
	);
});
