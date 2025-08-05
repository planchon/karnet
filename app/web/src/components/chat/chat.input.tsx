import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import { EditorContent, Node, useEditor } from "@tiptap/react";
import { observer } from "mobx-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Button } from "@ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup
} from "@ui/command";
import { ChevronDownIcon } from "lucide-react";
import { Shortcut } from "@ui/shortcut";
import { IconAssembly, IconBrain } from "@tabler/icons-react";
import Placeholder from "@tiptap/extension-placeholder";

type ChatInputProps = React.ComponentProps<"input">;

export const ChatInput = observer(function ChatInput({
  className,
  ...props
}: ChatInputProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: "use / for commands and @ for entities"
      })
    ],
    autofocus: "start",
    content: "",
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      console.log(text);
    }
  });

  return (
    <EditorContent
      className={cn("w-full", className)}
      editor={editor}
      {...props}
    />
  );
});

type ChatModelSelectProps = React.ComponentProps<"div">;

const providers = [
  {
    name: "OpenAI",
    models: [
      {
        name: "GPT-4o",
        value: "gpt-4o"
      },
      {
        name: "GPT-4o-mini",
        value: "gpt-4o-mini"
      },
      {
        name: "GPT-3.5-turbo",
        value: "gpt-3.5-turbo"
      }
    ]
  },
  {
    name: "Google",
    models: [
      {
        name: "Gemini 2.0 Flash",
        value: "gemini-2.0-flash"
      }
    ]
  },
  {
    name: "Anthropic",
    models: [
      {
        name: "Claude 3.5 Sonnet",
        value: "claude-3-5-sonnet"
      }
    ]
  }
];
export const ChatModelSelect = observer(function ChatModelSelect() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-700">
          <IconBrain className="size-4" />
          Select model
          <Shortcut shortcut={["M"]} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
            <CommandEmpty>No model found.</CommandEmpty>
            {providers.map((provider) => (
              <CommandGroup key={provider.name} heading={provider.name}>
                {provider.models.map((model) => (
                  <CommandItem key={model.value} value={model.value}>
                    {model.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});

const mcpProviders = [
  {
    category: "Database",
    items: [
      {
        name: "Postgres",
        value: "postgres"
      },
      {
        name: "MongoDB",
        value: "mongodb"
      }
    ]
  },
  {
    category: "Search",
    items: [
      {
        name: "Google",
        value: "google"
      },
      {
        name: "Wikipedia",
        value: "wikipedia"
      }
    ]
  },
  {
    category: "Clouds",
    items: [
      {
        name: "AWS",
        value: "aws"
      },
      {
        name: "GCP",
        value: "gcp"
      }
    ]
  }
];
export const ChatMCPSelect = observer(function ChatMCPSelect() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-gray-700">
          <IconAssembly className="size-4" />
          MCP
          <Shortcut shortcut={["S"]} nothen />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search MCP..." />
          <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
            <CommandEmpty>No MCP found.</CommandEmpty>
            {mcpProviders.map((provider) => (
              <CommandGroup key={provider.category} heading={provider.category}>
                {provider.items.map((item) => (
                  <CommandItem key={item.value} value={item.value}>
                    {item.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
});
