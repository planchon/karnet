import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { CommandChat } from "@/components/command/command-chat";
import { CreateEventCommand } from "@/components/command/command-events";
import { CommandK } from "@/components/command/command-k";
import { CreateProjectCommand } from "@/components/command/command-project";
import { CreateTaskCommand } from "@/components/command/command-task";
import { HelpComponent } from "@/components/help/help.comp";
import { AppSidebar } from "@/components/navbar/app-sidebar";
import { useLinkShortcut, useShortcut } from "@/hooks/useShortcut";
import { SidebarInset, SidebarProvider } from "@/primitive/ui/sidebar";
import { rootStore } from "@/stores/root.store";

export function GeneralOutlet() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useLinkShortcut('g+a', '/agent');
  useLinkShortcut("g+t", "/task");

  useLinkShortcut("g+c", "/chat");
  useLinkShortcut("c+c", "/chat");

  useLinkShortcut("g+d", "/document");
  useLinkShortcut("g+f", "/document?type=file");
  useLinkShortcut("g+s", "/document?type=sketch");

  useShortcut("Control+o", () => {
    navigate(-1);
  });

  useShortcut("Command+o", () => {
    navigate(-1);
  });

  useEffect(() => {
    console.group("loading stores");
    console.time("loading stores");

    rootStore.sketchesStore.load();
    rootStore.paperStore.load();
    rootStore.diagramStore.load();
    rootStore.taskStore.load();

    console.timeEnd("loading stores");
    console.groupEnd();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div />;
  }

  return (
    <SidebarProvider>
      <CommandK />
      <CreateEventCommand />
      <CommandChat />
      <HelpComponent />
      <CreateTaskCommand />
      <CreateProjectCommand />
      <AppSidebar variant="inset" />
      <SidebarInset className="max-h-[calc(100vh-16px)] overflow-hidden rounded-md border">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
