import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu
} from "@/primitive/ui/sidebar";
import { SuperLink } from "../../primitive/super-ui/link";

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
            <SuperLink
              key={item.title}
              title={item.title}
              url={item.url}
              icon={item.icon}
              tooltip={{
                title: item.tooltip.title,
                side: item.tooltip.side,
                shortcut: item.tooltip.shortcut
              }}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
