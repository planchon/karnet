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
  CalendarIcon,
  FileIcon,
  MessageCircleIcon,
  PencilIcon,
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
  commandEventsStore,
  toggleCommandKEvents,
  toggleCreateEventEvents
} from "@/stores/commands";
import { toggleTheme } from "@/stores/settings";

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
    toggleCommandKEvents();
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
      }
    ]
  };

  const agendaCommands: Group = {
    group: "Agenda",
    items: [
      {
        name: "New agenda event",
        shortcut: "c+a",
        action: () => {
          toggleCommandKEvents();
          toggleCreateEventEvents();
        },
        icon: CalendarPlus
      }
    ]
  };

  const pagesCommands: Group = {
    group: "Pages",
    items: [
      {
        name: "New page",
        shortcut: "c+p",
        action: () => {},
        icon: FilePlus
      }
    ]
  };

  const sketchesCommands: Group = {
    group: "Sketches",
    items: [
      {
        name: "New sketch",
        shortcut: "c+s",
        action: () => {},
        icon: Brush
      }
    ]
  };

  const chatCommands: Group = {
    group: "Chat",
    items: [
      {
        name: "New chat",
        shortcut: "c+c",
        action: () => {},
        icon: Sparkles
      }
    ]
  };

  const taskCommands: Group = {
    group: "Tasks",
    items: [
      {
        name: "New task",
        shortcut: "c+t",
        action: () => {},
        icon: ListCheck
      }
    ]
  };

  const projectCommands: Group = {
    group: "Projects",
    items: [
      {
        name: "New project",
        shortcut: "c+pr",
        action: () => {},
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
      onOpenChange={toggleCommandKEvents}
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
                  toggleCommandKEvents();
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
