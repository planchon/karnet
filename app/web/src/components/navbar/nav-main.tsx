import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Shortcut } from "../ui/shortcut";

export function NavMain({
  items
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
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1 transition-all">
        <SidebarMenu>
          {items.map((item) => (
            <NavLink
              to={item.url}
              key={item.title}
              className={({ isActive }) => (isActive ? "font-semibold" : "")}
            >
              <Tooltip delayDuration={800}>
                <TooltipTrigger className="w-full">
                  <SidebarMenuItem
                    key={item.title}
                    className="hover:cursor-pointer"
                  >
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>{" "}
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="ml-2 flex flex-row items-center gap-2"
                >
                  {item.tooltip.title}
                  {item.tooltip.shortcut && (
                    <Shortcut shortcut={item.tooltip.shortcut} />
                  )}
                </TooltipContent>
              </Tooltip>
            </NavLink>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
