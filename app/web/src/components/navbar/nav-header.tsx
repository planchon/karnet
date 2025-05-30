import { IconBell, IconSearch } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
        className
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
        className
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <SidebarHeaderContainer className={className} {...props}>
      <SidebarHeaderLogo>
        <img
          src="https://uploads.linear.app/11e50d11-cd50-48fb-87fa-892be26bf591/b878c925-289f-4dd0-a3c0-086635f99fe6/256x256/8ea6086a-0c06-4a69-ba17-ecab9104fc13"
          alt="supernotion"
          className="size-5 rounded-[4px]"
        />
        <span className="text-sm font-medium">supernotion</span>
      </SidebarHeaderLogo>
      <SidebarHeaderAction>
        <Button variant="ghost" size="icon" className="size-6">
          <IconSearch />
        </Button>
      </SidebarHeaderAction>
    </SidebarHeaderContainer>
  );
}

export { SidebarHeader, SidebarHeaderLogo, SidebarHeaderAction };
