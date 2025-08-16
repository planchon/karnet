import {
  IconDatabase,
  IconFileText,
  IconFileWord,
  IconHelp,
  IconListCheck,
  IconMessageCircle,
  IconReport,
  IconUsers,
} from '@tabler/icons-react';
import { observer } from "mobx-react";
import type * as React from "react";
import { NavMain } from "@/components/navbar/nav-main";
import { useCommands } from "@/hooks/useShortcut";
import { Sidebar, SidebarContent } from "@/primitive/ui/sidebar";
import { SidebarHeader } from "./nav-header";

export const AppSidebar = observer(function AppSidebarInner({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const commands = useCommands();

  const data = {
    user: {
      name: 'shadcn',
      email: 'm@example.com',
      avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
      {
        title: 'Documents',
        url: '/document',
        match: (pathname: string) =>
          pathname.includes('/document') ||
          pathname.includes('/paper') ||
          pathname.includes('/diagram') ||
          pathname.includes('/sketch'),
        icon: IconFileText,
        tooltip: {
          title: 'Go to documents',
          side: 'right' as const,
          shortcut: ['g', 'd'],
        },
      },
      {
        title: 'Tasks',
        url: '/task',
        match: (pathname: string) => pathname.includes('/task'),
        icon: IconListCheck,
        tooltip: {
          title: 'Go to tasks',
          side: 'right' as const,
          shortcut: ['g', 't'],
        },
      },
      {
        title: 'Chat',
        url: '/chat',
        match: (pathname: string) => pathname.includes('/chat'),
        icon: IconMessageCircle,
        tooltip: {
          title: 'Chat with an AI',
          side: 'right' as const,
          shortcut: ['g', 'c'],
        },
      },
      {
        title: 'Agents',
        url: '/agent',
        match: (pathname: string) => pathname.includes('/agent'),
        icon: IconUsers,
        tooltip: {
          title: 'Manage your agents',
          side: 'right' as const,
          shortcut: ['g', 'a'],
        },
      },
    ],
    navSecondary: [
      {
        title: 'Get Help',
        url: '#',
        icon: IconHelp,
        action: () => {
          commands.toggleHelp();
        },
      },
    ],
    documents: [
      {
        name: 'Data Library',
        url: '#',
        icon: IconDatabase,
      },
      {
        name: 'Reports',
        url: '#',
        icon: IconReport,
      },
      {
        name: 'Word Assistant',
        url: '#',
        icon: IconFileWord,
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  );
});
