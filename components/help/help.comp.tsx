"use client";

import { X } from "lucide-react";
import { observer } from "mobx-react";
import { useHotkeys } from "react-hotkeys-hook";
import { useCommands } from "@/hooks/useCommand";
import { Button } from "@/primitive/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/primitive/ui/drawer";
import { Input } from "@/primitive/ui/input";
import { Shortcut } from "@/primitive/ui/shortcut";

const shortcuts = [
    {
        category: "Navigation",
        shortcuts: [
            {
                shortcut: "g+a",
                description: "Go to agenda",
            },
            {
                shortcut: "g+p",
                description: "Go to projects",
            },
            {
                shortcut: "g+t",
                description: "Go to tasks",
            },
            {
                shortcut: "g+f",
                description: "Go to files",
            },
            {
                shortcut: "g+s",
                description: "Go to sketches",
            },
            {
                shortcut: "g+c",
                description: "Go to chat",
            },
        ],
    },
    {
        category: "Panels",
        shortcuts: [
            {
                shortcut: "⌘+s",
                description: "Toggle the sidebar",
            },
            {
                shortcut: "⌘+k",
                description: "Open the command palette",
            },
        ],
    },
    {
        category: "Task",
        shortcuts: [
            {
                shortcut: "c+t",
                description: "Create new task",
            },
        ],
    },
    {
        category: "Project",
        shortcuts: [
            {
                shortcut: "c+p",
                description: "Create new project",
            },
        ],
    },
    {
        category: "Agenda",
        shortcuts: [
            {
                shortcut: "c+e",
                description: "Create new agenda event",
            },
        ],
    },
    {
        category: "Files",
        shortcuts: [
            {
                shortcut: "c+f",
                description: "Create new file",
            },
            {
                shortcut: "g+f",
                description: "Go to infinite file",
            },
        ],
    },
    {
        category: "Sketches",
        shortcuts: [
            {
                shortcut: "c+s",
                description: "Create new sketch",
            },
            {
                shortcut: "g+s",
                description: "Go to infinite sketch",
            },
        ],
    },
    {
        category: "Chat",
        shortcuts: [
            {
                shortcut: "c+c",
                description: "Create new chat",
            },
        ],
    },
];

export const HelpComponent = observer(function HelpComponentInner() {
    const commands = useCommands();

    useHotkeys("?", () => {
        commands.toggleHelp();
    });

    return (
        <Drawer direction="right" onOpenChange={commands.toggleHelp} open={commands.helpOpen}>
            <DrawerContent className="z-500">
                <DrawerHeader>
                    <DrawerTitle>Keyboard shortcuts</DrawerTitle>
                    <DrawerClose className="absolute top-4 right-4">
                        <Button className="size-6" size="icon" variant="ghost">
                            <X />
                        </Button>
                    </DrawerClose>
                    <DrawerDescription>
                        <div className="flex flex-col gap-2">
                            <Input className="mt-4 h-10 w-full" placeholder="Search shortcuts" />
                            <div className="mt-3 flex flex-col gap-5">
                                {shortcuts.map((category) => (
                                    <div className="flex flex-col gap-2" key={category.category}>
                                        <div key={category.category}>
                                            <span className="font-semibold text-primary/90 text-sm">
                                                {category.category}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {category.shortcuts.map((shortcut) => (
                                                <div
                                                    className="flex items-center justify-between gap-2"
                                                    key={shortcut.shortcut}
                                                >
                                                    <span className="text-muted-foreground text-sm">
                                                        {shortcut.description}
                                                    </span>
                                                    <Shortcut shortcut={shortcut.shortcut.split("+")} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
});
