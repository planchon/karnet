import { observer } from "mobx-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSettings } from "@/hooks/useStores";
import { cn } from "@/lib/utils";
import { SidebarMenuButton, SidebarMenuItem } from "@/primitive/ui/sidebar";
import { TooltipWrapper } from "./tooltip-wrapper";

type SuperLinkProps = {
	title: string;
	icon?: React.ComponentType<{ className?: string }>;
	tooltip: {
		title: string;
		side?: "top" | "right" | "bottom" | "left";
		shortcut?: string[];
	};
} & React.ComponentProps<typeof Link>;

export const SuperLink = observer(function SuperLink({
	title,
	icon: Icon,
	tooltip,
	...props
}: SuperLinkProps) {
	const settings = useSettings();
	const linkEnabled = !settings.disableLinks;

	const isActive = usePathname().includes(props.href.toString());

	return (
		<Link
			key={title}
			draggable={false}
			tabIndex={-1}
			className={cn(
				"text-accent-foreground rounded-[4px] hover:cursor-pointer",
				!linkEnabled && "pointer-events-none select-none",
			)}
			{...props}
		>
			<TooltipWrapper tooltip={tooltip} className="w-full">
				<SidebarMenuItem
					key={title}
					className="hover:cursor-pointer"
					tabIndex={-1}
				>
					<SidebarMenuButton tooltip={title} className="group/item">
						{Icon && (
							<Icon
								className={cn(
									isActive
										? "text-accent-foreground"
										: "text-accent-foreground/80",
								)}
							/>
						)}
						<span className="truncate">{title}</span>{" "}
					</SidebarMenuButton>
				</SidebarMenuItem>{" "}
			</TooltipWrapper>
		</Link>
	);
});
