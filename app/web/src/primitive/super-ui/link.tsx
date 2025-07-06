import { SidebarMenuButton, SidebarMenuItem } from "@/primitive/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/primitive/ui/tooltip";
import { NavLink } from "react-router";
import { Shortcut } from "@/primitive/ui/shortcut";
import { cn } from "@/lib/utils";
import { TooltipWrapper } from "./tooltip-wrapper";
import { useSettings } from "@/hooks/useStores";
import { observer } from "mobx-react";

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

export const SuperLink = observer(function SuperLink({
  title,
  url,
  icon: Icon,
  tooltip
}: SuperLinkProps) {
  const settings = useSettings();
  const linkEnabled = !settings.disableLinks;

  return (
    <NavLink
      to={url}
      key={title}
      draggable={false}
      tabIndex={-1}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          "text-accent-foreground rounded-[4px] hover:cursor-pointer",
          isActive ? "bg-sidebar-accent" : "",
          !linkEnabled && "pointer-events-none select-none"
        )
      }
    >
      {({ isActive }: { isActive: boolean }) => (
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
                      : "text-accent-foreground/80 group-hover/item:text-accent-foreground"
                  )}
                />
              )}
              <span className="truncate">{title}</span>{" "}
            </SidebarMenuButton>
          </SidebarMenuItem>{" "}
        </TooltipWrapper>
      )}
    </NavLink>
  );
});
