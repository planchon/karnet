import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandDialog
} from "@/primitive/ui/command";
import { useShortcut } from "@/hooks/useShortcut";
import { useNavigate } from "react-router";
import {
  LucideIcon,
  CalendarPlus,
  FilePlus,
  Brush,
  Sparkles,
  Briefcase,
  Moon,
  Sun,
  ArrowRight
} from "lucide-react";
import {
  Icon123,
  IconHelpCircle,
  IconInfinity,
  IconLink,
  IconListDetails,
  IconTextPlus
} from "@tabler/icons-react";
import { useCommands } from "@/hooks/useShortcut";
import { useSettings, useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";
import { generateId } from "@/lib/utils";
import { Command as CommandType } from "@/stores/command.store";

type Group = {
  group: string;
  items: CommandType[];
};

export const CommandK = observer(function CommandK() {
  const commands = useCommands();
  const navigate = useNavigate();
  const settings = useSettings();
  const commandStore = useStores().commandStore;
  const store = useStores();

  useShortcut("Command+k", () => {
    commands.toggleCommandK();
  });

  useShortcut("Control+k", () => {
    commands.toggleCommandK();
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
        name: "Go to tasks",
        shortcut: "g+t",
        action: () => {
          navigate("/task");
        },
        icon: ArrowRight
      },
      {
        name: "Go to projects",
        shortcut: "g+p",
        action: () => {
          navigate("/project");
        },
        icon: ArrowRight
      },
      {
        name: "Go to documents",
        shortcut: "g+d",
        action: () => {
          navigate("/file");
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
          commands.toggleHelp();
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
          commands.toggleEvent();
        },
        icon: CalendarPlus
      }
    ]
  };

  const pagesCommands: Group = {
    group: "Files",
    items: [
      {
        name: "Create a new file",
        shortcut: "c+f",
        action: () => {
          const id = generateId();
          store.paperStore.createModel(id);
          navigate(`/file/${id}`);
        },
        icon: FilePlus
      },
      {
        name: "Go to the infinite file",
        shortcut: "g+f",
        icon: IconInfinity,
        action: () => {
          navigate("/file/infinite");
        }
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
          const id = generateId();
          store.sketchesStore.createModel(id);
          navigate(`/sketch/${id}`);
        },
        icon: Brush
      },
      {
        name: "Go to the infinite sketch",
        shortcut: "g+S",
        icon: IconInfinity,
        action: () => {
          navigate("/sketch/infinite");
        }
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
          commands.toggleChat();
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
          commands.toggleTask();
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
          commands.toggleProject();
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
          settings.setTheme("dark");
        },
        icon: Moon
      },
      {
        name: "Switch to light theme",
        shortcut: "",
        action: () => {
          settings.setTheme("light");
        },
        icon: Sun
      },
      {
        name: `${settings.disableLinks ? "Enable" : "Disable"} links`,
        shortcut: "",
        action: () => {
          settings.setDisableLinks(!settings.disableLinks);
        },
        icon: IconLink
      }
    ]
  };

  const commandsList: Group[] = [
    ...commandStore.contextualCommands,
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
      open={commands.commandKOpen}
      onOpenChange={(open) => {
        commands.toggleCommandK();
        if (!open) {
          if (commands.lastFocus) {
            const element = document.getElementById(commands.lastFocus);
            if (element) {
              setTimeout(() => {
                element.focus();
              }, 0);
            }
          }
        }
      }}
      className="min-w-[700px]"
    >
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandsList.map((command: Group) => (
          <CommandGroup key={command.group} heading={command.group}>
            {command.items.map((item: CommandType) => (
              <CommandItem
                key={item.name}
                className="hover:cursor-pointer"
                onSelect={() => {
                  item.action();
                  commands.toggleCommandK();
                  if (commands.lastFocus) {
                    const element = document.getElementById(commands.lastFocus);
                    if (element) {
                      setTimeout(() => {
                        element.focus();
                      }, 0);
                    }
                  }
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
});
