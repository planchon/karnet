import { AppSidebar } from "@/components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { useLinkShortcut } from "@/hooks/useShortcut";
import { HelpComponent } from "@/components/help/help.comp";

export function GeneralOutlet() {
  useLinkShortcut("g+a", "/agenda");
  useLinkShortcut("g+p", "/pages");
  useLinkShortcut("g+s", "/sketches");
  useLinkShortcut("g+c", "/chat");

  return (
    <SidebarProvider>
      <HelpComponent />
      <AppSidebar variant="inset" />
      <SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
