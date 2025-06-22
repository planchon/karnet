import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { NavLink } from "react-router";
import { Shortcut } from "../ui/shortcut";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "./tooltip-wrapper";

type SuperLinkProps = {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
  tooltip: {
    title: string;
    side?: "top" | "right" | "bottom" | "left";
    shortcut?: string[];
  };
};

export const SuperLink = ({
  title,
  url,
  icon: Icon,
  tooltip
}: SuperLinkProps) => {
  return (
    <NavLink
      to={url}
      key={title}
      draggable={false}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "text-accent-foreground rounded-[4px] hover:cursor-pointer",
          isActive ? "bg-sidebar-accent" : ""
        )
      }
    >
      {({ isActive }: { isActive: boolean }) => (
        <TooltipWrapper tooltip={tooltip} className="w-full">
          <SidebarMenuItem key={title} className="hover:cursor-pointer">
            <SidebarMenuButton tooltip={title} className="group/item">
              {Icon && (
                <Icon
                  className={cn(
                    isActive
                      ? "text-accent-foreground"
                      : "text-accent-foreground/80 group-hover/item:text-accent-foreground"
                  )}
                />
              )}
              <span className="truncate">{title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>{" "}
        </TooltipWrapper>
      )}
    </NavLink>
  );
};
