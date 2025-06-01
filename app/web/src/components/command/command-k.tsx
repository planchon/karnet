import { useState } from "react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandDialog
} from "../ui/command";
import { useShortcut } from "@/hooks/useShortcut";
import { useNavigate } from "react-router";
import {
  LucideIcon,
  CalendarPlus,
  FilePlus,
  Brush,
  Sparkles,
  ListCheck,
  Briefcase,
  Moon,
  Sun,
  ArrowRight
} from "lucide-react";
import { useSnapshot } from "valtio";
import {
  closeCommandK,
  commandEventsStore,
  toggleCommandK,
  toggleCreateChat,
  toggleCreateEvents,
  toggleCreateProject,
  toggleCreateTask,
  toggleHelp
} from "@/stores/commands";
import { toggleTheme } from "@/stores/settings";
import {
  IconChecklist,
  IconHelpCircle,
  IconListDetails,
  IconPlus,
  IconTextPlus
} from "@tabler/icons-react";

type Item = {
  name: string;
  shortcut: string;
  action: () => void;
  icon?: LucideIcon;
};

type Group = {
  group: string;
  items: Item[];
};

type Command = Group[];

export const CommandK = () => {
  const open = useSnapshot(commandEventsStore).commandKOpen;
  const navigate = useNavigate();

  useShortcut("Meta+k", () => {
    toggleCommandK();
  });

  const navigationCommands: Group = {
    group: "Navigation",
    items: [
      {
        name: "Go to agenda",
        shortcut: "g+a",
        action: () => {
          navigate("/agenda");
        },
        icon: ArrowRight
      },
      {
        name: "Go to pages",
        shortcut: "g+p",
        action: () => {
          navigate("/pages");
        },
        icon: ArrowRight
      },
      {
        name: "Go to sketches",
        shortcut: "g+s",
        action: () => {
          navigate("/sketches");
        },
        icon: ArrowRight
      },
      {
        name: "Go to chat",
        shortcut: "g+c",
        action: () => {
          navigate("/chat");
        },
        icon: ArrowRight
      },
      {
        name: "Go to help",
        shortcut: "?",
        action: () => {
          toggleHelp();
        },
        icon: IconHelpCircle
      }
    ]
  };

  const agendaCommands: Group = {
    group: "Agenda",
    items: [
      {
        name: "Create a new event",
        shortcut: "c+a",
        action: () => {
          toggleCreateEvents();
        },
        icon: CalendarPlus
      }
    ]
  };

  const pagesCommands: Group = {
    group: "Documents",
    items: [
      {
        name: "Create a new document",
        shortcut: "c+d",
        action: () => {
          navigate("/documents");
        },
        icon: FilePlus
      }
    ]
  };

  const sketchesCommands: Group = {
    group: "Sketches",
    items: [
      {
        name: "Create a new sketch",
        shortcut: "c+s",
        action: () => {
          navigate("/sketches");
        },
        icon: Brush
      }
    ]
  };

  const chatCommands: Group = {
    group: "Chat",
    items: [
      {
        name: "Create a new chat",
        shortcut: "c+c",
        action: () => {
          toggleCreateChat();
        },
        icon: Sparkles
      }
    ]
  };

  const taskCommands: Group = {
    group: "Tasks",
    items: [
      {
        name: "Create a new task",
        shortcut: "c+t",
        action: () => {
          toggleCreateTask();
        },
        icon: IconTextPlus
      },
      {
        name: "See all tasks",
        shortcut: "g+t",
        icon: IconListDetails,
        action: () => {
          navigate("/task");
        }
      }
    ]
  };

  const projectCommands: Group = {
    group: "Projects",
    items: [
      {
        name: "Create a new project",
        shortcut: "c+p",
        action: () => {
          toggleCreateProject();
        },
        icon: Briefcase
      }
    ]
  };

  const settingsCommands: Group = {
    group: "Settings",
    items: [
      {
        name: "Switch to dark theme",
        shortcut: "",
        action: () => {
          toggleTheme("dark");
        },
        icon: Moon
      },
      {
        name: "Switch to light theme",
        shortcut: "",
        action: () => {
          toggleTheme("light");
        },
        icon: Sun
      }
    ]
  };

  const commands: Command = [
    taskCommands,
    agendaCommands,
    pagesCommands,
    sketchesCommands,
    chatCommands,
    projectCommands,
    settingsCommands,
    navigationCommands
  ];

  return (
    <CommandDialog
      open={open}
      onOpenChange={toggleCommandK}
      className="min-w-[700px]"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((command) => (
          <CommandGroup key={command.group} heading={command.group}>
            {command.items.map((item) => (
              <CommandItem
                key={item.name}
                className="hover:cursor-pointer"
                onSelect={() => {
                  item.action();
                  closeCommandK();
                }}
              >
                {item.icon && <item.icon className="ml-1" />}
                <span>{item.name}</span>
                <CommandShortcut className="mr-1">
                  {item.shortcut}
                </CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
