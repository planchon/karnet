"use client";

import {
    IconBrain,
    IconHelpCircle,
    IconInfinity,
    IconLink,
    IconListDetails,
    IconTextPlus,
    IconTrash,
} from "@tabler/icons-react";
import { ArrowRight, Briefcase, Brush, CalendarPlus, FilePlus, Moon, Sparkles, Sun } from "lucide-react";
import { observer } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useNavigate } from "react-router";
import { useCommands } from "@/hooks/useCommand";
import { useSettings, useStores } from "@/hooks/useStores";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
} from "@/primitive/ui/command";
import type { Command as CommandType } from "@/stores/command.store";

type Group = {
    group: string;
    items: CommandType[];
};

export const CommandK = observer(function CommandKInner() {
    const navigate = useNavigate();
    const settings = useSettings();
    const commands = useCommands();
    const commandStore = useStores().commandStore;

    useHotkeys("Command+k", () => {
        commands.toggleCommandK();
    });

    useHotkeys("Control+k", () => {
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
                icon: ArrowRight,
            },
            {
                name: "Go to tasks",
                shortcut: "g+t",
                action: () => {
                    navigate("/task");
                },
                icon: ArrowRight,
            },
            {
                name: "Go to projects",
                shortcut: "g+p",
                action: () => {
                    navigate("/project");
                },
                icon: ArrowRight,
            },
            {
                name: "Go to documents",
                shortcut: "g+d",
                action: () => {
                    navigate("/file");
                },
                icon: ArrowRight,
            },
            {
                name: "Go to chat",
                shortcut: "g+c",
                action: () => {
                    navigate("/chat");
                },
                icon: ArrowRight,
            },
            {
                name: "Go to help",
                shortcut: "?",
                action: () => {
                    commands.toggleHelp();
                },
                icon: IconHelpCircle,
            },
        ],
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
                icon: CalendarPlus,
            },
        ],
    };

    const pagesCommands: Group = {
        group: "Paper",
        items: [
            {
                name: "Create a new paper",
                shortcut: "c+f",
                action: () => {
                    // const id = generateId();
                    // store.paperStore.createModel(id);
                    // navigate(`/paper/${id}`);
                },
                icon: FilePlus,
            },
        ],
    };

    const sketchesCommands: Group = {
        group: "Sketches",
        items: [
            {
                name: "Create a new sketch",
                shortcut: "c+s",
                action: () => {
                    // const id = generateId();
                    // store.sketchesStore.createModel(id);
                    // navigate(`/sketch/${id}`);
                },
                icon: Brush,
            },
            {
                name: "Go to the infinite sketch",
                shortcut: "g+S",
                icon: IconInfinity,
                action: () => {
                    navigate("/sketch/infinite");
                },
            },
        ],
    };

    const chatCommands: Group = {
        group: "Chat",
        items: [
            {
                name: "Create a new chat",
                shortcut: "c+c",
                action: () => {
                    navigate("/chat");
                },
                icon: Sparkles,
            },
        ],
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
                icon: IconTextPlus,
            },
            {
                name: "See all tasks",
                shortcut: "g+t",
                icon: IconListDetails,
                action: () => {
                    navigate("/task");
                },
            },
        ],
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
                icon: Briefcase,
            },
        ],
    };

    const settingsCommands: Group = {
        group: "Settings",
        items: [
            {
                name: "Open models settings",
                action: () => {
                    navigate("/settings/models");
                },
                icon: IconBrain,
            },
            {
                name: "Switch to dark theme",
                shortcut: "",
                action: () => {
                    settings.setTheme("dark");
                },
                icon: Moon,
            },
            {
                name: "Switch to light theme",
                shortcut: "",
                action: () => {
                    settings.setTheme("light");
                },
                icon: Sun,
            },
            {
                name: `${settings.disableLinks ? "Enable" : "Disable"} links`,
                shortcut: "",
                action: () => {
                    settings.setDisableLinks(!settings.disableLinks);
                },
                icon: IconLink,
            },
        ],
    };

    const devCommands: Group = {
        group: "Wizard Commands",
        items: [
            {
                name: "Wipe local storage",
                action: () => {
                    localStorage.clear();
                    window.location.reload();
                },
                icon: IconTrash,
            },
        ],
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
        navigationCommands,
        devCommands,
    ];

    return (
        <CommandDialog
            className="min-w-[700px]"
            onOpenChange={(open) => {
                commands.toggleCommandK();
                if (!open && commands.lastFocus) {
                    const element = document.getElementById(commands.lastFocus);
                    if (element) {
                        setTimeout(() => {
                            element.focus();
                        }, 0);
                    }
                }
            }}
            open={commands.commandKOpen}
        >
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {commandsList.map((command: Group) => (
                    <CommandGroup heading={command.group} key={command.group}>
                        {command.items.map((item: CommandType) => (
                            <CommandItem
                                className="hover:cursor-pointer"
                                key={item.name}
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
                                <CommandShortcut className="mr-1">{item.shortcut}</CommandShortcut>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
});
