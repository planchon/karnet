import * as React from "react";
import {
  IconDatabase,
  IconFileWord,
  IconHelp,
  IconReport,
  IconFileText,
  IconCalendar,
  IconPencilStar,
  IconMessageCircle
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/navbar/nav-documents";
import { NavMain } from "@/components/navbar/nav-main";
import { NavSecondary } from "@/components/navbar/nav-secondary";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

import { SidebarHeader } from "./nav-header";

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
        side: "right",
        shortcut: ["G", "A"]
      }
    },
    {
      title: "Pages",
      url: "/pages",
      icon: IconFileText,
      tooltip: {
        title: "Write a new page",
        side: "right",
        shortcut: ["G", "P"]
      }
    },
    {
      title: "Sketches",
      url: "/sketches",
      icon: IconPencilStar,
      tooltip: {
        title: "Draw a new sketch",
        side: "right",
        shortcut: ["G", "S"]
      }
    },
    {
      title: "Chat",
      url: "/chat",
      icon: IconMessageCircle,
      tooltip: {
        title: "Chat with an AI",
        side: "right",
        shortcut: ["G", "C"]
      }
    }
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
}
