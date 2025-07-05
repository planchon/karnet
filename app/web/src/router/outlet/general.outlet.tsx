import { AppSidebar } from "@/components/navbar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/primitive/ui/sidebar";
import { Outlet, useNavigate } from "react-router";
import { useLinkShortcut, useShortcut } from "@/hooks/useShortcut";
import { HelpComponent } from "@/components/help/help.comp";
import { CommandK } from "@/components/command/command-k";
import { CreateEventCommand } from "@/components/command/command-events";
import { CommandChat } from "@/components/command/command-chat";
import { CreateTaskCommand } from "@/components/command/command-task";
import { CreateProjectCommand } from "@/components/command/command-project";
import { generateId } from "@/lib/utils";
import { rootStore } from "@/stores/root.store";
import { useEffect, useState } from "react";

export function GeneralOutlet() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useLinkShortcut("g+a", "/agenda");
  useLinkShortcut("g+t", "/task");
  useLinkShortcut("g+c", "/chat");
  useLinkShortcut("g+d", "/document");
  useLinkShortcut("g+f", `/document?type=file`);
  useLinkShortcut("g+s", `/document?type=sketch`);

  useShortcut("Control+o", () => {
    navigate(-1);
  });

  useShortcut("Command+o", () => {
    navigate(-1);
  });

  useShortcut("c+f", () => {
    const id = generateId();
    const document = rootStore.paperStore.createModel(id);
    navigate(`/file/${id}`);
  });

  useShortcut("c+s", () => {
    const id = generateId();
    const sketch = rootStore.sketchesStore.createModel(id);
    navigate(`/sketch/${id}`);
  });

  useEffect(() => {
    rootStore.sketchesStore.load();
    rootStore.paperStore.load();
    rootStore.diagramStore.load();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div></div>;
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
