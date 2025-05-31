import { AppSidebar } from "@/components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { useLinkShortcut } from "@/hooks/useShortcut";
import { HelpComponent } from "@/components/help/help.comp";
import { CommandK } from "@/components/command/command-k";
import { CreateEventCommand } from "@/components/command/command-events";
import { CommandChat } from "@/components/command/command-chat";

export function GeneralOutlet() {
  useLinkShortcut("g+a", "/agenda");
  useLinkShortcut("g+p", "/project");
  useLinkShortcut("g+t", "/task");
  useLinkShortcut("g+c", "/chat");

  return (
    <SidebarProvider>
      <CommandK />
      <CreateEventCommand />
      <CommandChat />
      <HelpComponent />
      <AppSidebar variant="inset" />
      <SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
