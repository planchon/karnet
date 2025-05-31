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

export const CommandK = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useShortcut("Meta+k", () => {
    setOpen(true);
  });

  const commands = [
    {
      group: "Navigation",
      items: [
        {
          name: "Go to agenda",
          shortcut: "g+a",
          action: () => {
            navigate("/agenda");
          }
        },
        {
          name: "Go to pages",
          shortcut: "g+p",
          action: () => {
            navigate("/pages");
          }
        },
        {
          name: "Go to sketches",
          shortcut: "g+s",
          action: () => {
            navigate("/sketches");
          }
        },
        {
          name: "Go to chat",
          shortcut: "g+c",
          action: () => {
            navigate("/chat");
          }
        }
      ]
    },
    {
      group: "Agenda",
      items: [
        {
          name: "New agenda event",
          shortcut: "c+a",
          action: () => {}
        }
      ]
    },
    {
      group: "Pages",
      items: [
        {
          name: "New page",
          shortcut: "c+p",
          action: () => {}
        }
      ]
    },
    {
      group: "Sketches",
      items: [
        {
          name: "New sketch",
          shortcut: "c+s",
          action: () => {}
        }
      ]
    },
    {
      group: "Chat",
      items: [
        {
          name: "New chat",
          shortcut: "c+c",
          action: () => {}
        }
      ]
    }
  ];

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commands.map((command) => (
          <CommandGroup key={command.group} heading={command.group}>
            {command.items.map((item) => (
              <CommandItem
                key={item.name}
                onSelect={() => {
                  item.action();
                  setOpen(false);
                }}
              >
                <span>{item.name}</span>
                <CommandShortcut>{item.shortcut}</CommandShortcut>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
};
