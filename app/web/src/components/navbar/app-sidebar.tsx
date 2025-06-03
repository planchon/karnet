import * as React from "react";
import {
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconFileText,
  IconCalendar,
  IconPencilStar,
  IconMessageCircle,
  IconBriefcase,
  IconListCheck
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/navbar/nav-documents";
import { NavMain } from "@/components/navbar/nav-main";
import { NavSecondary } from "@/components/navbar/nav-secondary";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { SidebarHeader } from "./nav-header";
import { useCommands } from "@/hooks/useShortcut";
import { observer } from "mobx-react";

export const AppSidebar = observer(function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const commands = useCommands();

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg"
    },
    navMain: [
      {
        title: "Agenda",
        url: "/agenda",
        icon: IconCalendar,
        tooltip: {
          title: "Go to agenda",
          side: "right" as const,
          shortcut: ["g", "a"]
        }
      },
      {
        title: "Projects",
        url: "/project",
        icon: IconBriefcase,
        tooltip: {
          title: "Go to projects",
          side: "right" as const,
          shortcut: ["g", "p"]
        }
      },
      {
        title: "Tasks",
        url: "/task",
        icon: IconListCheck,
        tooltip: {
          title: "Go to tasks",
          side: "right" as const,
          shortcut: ["g", "t"]
        }
      },
      {
        title: "Chat",
        url: "/chat",
        icon: IconMessageCircle,
        tooltip: {
          title: "Chat with an AI",
          side: "right" as const,
          shortcut: ["g", "c"]
        }
      },
      {
        title: "Documents",
        url: "/document",
        icon: IconFileText,
        tooltip: {
          title: "Go to documents",
          side: "right" as const,
          shortcut: ["g", "d"]
        }
      }
    ],
    navSecondary: [
      {
        title: "Get Help",
        url: "#",
        icon: IconHelp,
        action: () => {
          commands.toggleHelp();
        }
      }
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord
      }
    ]
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
});
