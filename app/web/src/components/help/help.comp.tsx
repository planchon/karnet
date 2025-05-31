import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "../ui/drawer";
import { useShortcut } from "@/hooks/useShortcut";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Shortcut } from "../ui/shortcut";

const shortcuts = [
  {
    category: "Navigation",
    shortcuts: [
      {
        shortcut: "g+a",
        description: "Go to agenda"
      },
      {
        shortcut: "g+p",
        description: "Go to pages"
      },
      {
        shortcut: "g+s",
        description: "Go to sketches"
      },
      {
        shortcut: "g+c",
        description: "Go to chat"
      }
    ]
  },
  {
    category: "Agenda",
    shortcuts: [
      {
        shortcut: "c+a",
        description: "Create new agenda event"
      }
    ]
  },
  {
    category: "Pages",
    shortcuts: [
      {
        shortcut: "c+p",
        description: "Create new page"
      }
    ]
  },
  {
    category: "Sketches",
    shortcuts: [
      {
        shortcut: "c+s",
        description: "Create new sketch"
      }
    ]
  },
  {
    category: "Chat",
    shortcuts: [
      {
        shortcut: "c+c",
        description: "Create new chat"
      }
    ]
  }
];

export const HelpComponent = () => {
  const [open, setOpen] = useState(false);

  useShortcut("?", () => {
    setOpen(true);
  });

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerContent className="z-[500]">
        <DrawerHeader>
          <DrawerTitle>Keyboard shortcuts</DrawerTitle>
          <DrawerClose className="absolute right-4 top-4">
            <Button variant="ghost" size="icon" className="size-6">
              <X />
            </Button>
          </DrawerClose>
          <DrawerDescription>
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Search shortcuts"
                className="mt-4 h-10 w-full"
              />
              <div className="mt-3 flex flex-col gap-5">
                {shortcuts.map((category) => (
                  <div className="flex flex-col gap-2">
                    <div key={category.category}>
                      <span className="text-primary/90 text-sm font-semibold">
                        {category.category}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      {category.shortcuts.map((shortcut) => (
                        <div
                          key={shortcut.shortcut}
                          className="flex items-center justify-between gap-2"
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
};
