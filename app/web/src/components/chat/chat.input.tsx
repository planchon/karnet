import { MCP } from '@lobehub/icons';
import { IconBrain } from '@tabler/icons-react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';
import { Button } from '@ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { Shortcut } from '@ui/shortcut';
import { observer } from 'mobx-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ChatContext } from './chat.root';
import { RewriteEnter } from './extensions/enter';
import { MultipleTextualCommands } from './extensions/textual-commands';

const providers = [
  {
    name: 'OpenAI',
    models: [
      {
        name: 'GPT-4o',
        value: 'gpt-4o',
      },
      {
        name: 'GPT-4o-mini',
        value: 'gpt-4o-mini',
      },
      {
        name: 'GPT-3.5-turbo',
        value: 'gpt-3.5-turbo',
      },
    ],
  },
  {
    name: 'Google',
    models: [
      {
        name: 'Gemini 2.0 Flash',
        value: 'gemini-2.0-flash',
      },
    ],
  },
  {
    name: 'Anthropic',
    models: [
      {
        name: 'Claude 3.5 Sonnet',
        value: 'claude-3-5-sonnet',
      },
    ],
  },
];
export const ChatModelSelect = observer(function ChatModelSelectInner() {
  const { model, setModel, modelRef } = useContext(ChatContext);
  const [open, setOpen] = useState(false);

  function handleSelect(value: string) {
    setModel(value);
    setOpen(false);
  }

  function getRenderingName(value: string) {
    const modelItem = providers
      .flatMap((provider) => provider.models)
      .find((modelItemIterator) => modelItemIterator.value === value);
    return modelItem?.name;
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className="outline-none ring-0" ref={modelRef}>
        <Button
          className="h-6 px-2 text-gray-700 outline-none ring-0"
          size="sm"
          variant="ghost"
        >
          <IconBrain className="size-4" />
          {model ? getRenderingName(model) : 'Model'}
          <Shortcut shortcut={['M']} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
            <CommandEmpty>No model found.</CommandEmpty>
            {providers.map((provider) => (
              <CommandGroup heading={provider.name} key={provider.name}>
                {provider.models.map((modelItem) => (
                  <CommandItem
                    key={modelItem.value}
                    onSelect={() => handleSelect(modelItem.value)}
                    value={modelItem.value}
                  >
                    {modelItem.name}
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
    category: 'Database',
    items: [
      {
        name: 'Postgres',
        value: 'postgres',
      },
      {
        name: 'MongoDB',
        value: 'mongodb',
      },
    ],
  },
  {
    category: 'Search',
    items: [
      {
        name: 'Google',
        value: 'google',
      },
      {
        name: 'Wikipedia',
        value: 'wikipedia',
      },
    ],
  },
  {
    category: 'Clouds',
    items: [
      {
        name: 'AWS',
        value: 'aws',
      },
      {
        name: 'GCP',
        value: 'gcp',
      },
    ],
  },
];
export const ChatMCPSelect = observer(function ChatMCPSelectInner() {
  const { mcp, setMcp, mcpRef } = useContext(ChatContext);
  const [open, setOpen] = useState(false);

  function handleSelect(value: string) {
    setMcp(value);
    setOpen(false);
  }

  function getRenderingName(value: string) {
    const mcpItem = mcpProviders
      .flatMap((provider) => provider.items)
      .find((mcpItemIterator) => mcpItemIterator.value === value);
    return mcpItem?.name;
  }
  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger className="outline-none ring-0" ref={mcpRef}>
        <Button
          className="h-6 px-2 text-gray-700 outline-none ring-0"
          size="sm"
          variant="ghost"
        >
          <MCP className="size-4" />
          {mcp ? getRenderingName(mcp) : 'MCP'}
          <Shortcut nothen shortcut={['S']} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search MCP..." />
          <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
            <CommandEmpty>No MCP found.</CommandEmpty>
            {mcpProviders.map((provider) => (
              <CommandGroup heading={provider.category} key={provider.category}>
                {provider.items.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => handleSelect(item.value)}
                    value={item.value}
                  >
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

export const ChatInput = observer(function ChatInputInside({
  className,
}: {
  className?: string;
}) {
  const modelRef = useRef<HTMLButtonElement>(null);
  const mcpRef = useRef<HTMLButtonElement>(null);

  const { setModel, setMcp } = useContext(ChatContext);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document.configure({
        HTMLAttributes: {
          class: 'text-sm!',
        },
      }),
      Paragraph.configure({
        HTMLAttributes: {
          class: 'min-h-[1rem] mt-0',
          // the tailwind text-sm! is not working here
          style: 'font-size: 13px;',
        },
      }),
      Text.configure({
        HTMLAttributes: {
          class: 'text-sm! min-h-[1rem]',
        },
      }),
      Placeholder.configure({
        placeholder: 'use / for commands and @ for entities',
        emptyNodeClass:
          'placeholder:text-[13px] placeholder:min-h-[1rem] placeholder:mt-0 text-sm!',
      }),
      MultipleTextualCommands,
      RewriteEnter,
    ],
    autofocus: 'start',
    content: '',
    editorProps: {
      attributes: {
        style: 'font-size: 13px;',
      },
    },
    onUpdate: ({ editor: e }) => {
      const text = e.getText();
      console.log(text);
    },
  });

  useEffect(() => {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        // biome-ignore lint/style/useBlockStatements: useless
        if (!editor) return;
        editor.commands.blur();
      }

      if (['/', 't', ' '].includes(e.key)) {
        e.preventDefault();
        // biome-ignore lint/style/useBlockStatements: useless
        if (!editor) return;
        editor.commands.focus();
      }
    });
  }, [editor]);

  const modelMCPHandler = (e: KeyboardEvent) => {
    if (editor?.isFocused) {
      return;
    }

    if (e.key === 'm' && modelRef.current?.value) {
      modelRef.current?.click();
      setModel(modelRef.current?.value);
      e.preventDefault();
      return;
    }

    if (e.key === 's' && mcpRef.current?.value) {
      mcpRef.current?.click();
      setMcp(mcpRef.current?.value);
      e.preventDefault();
      return;
    }

    if (e.key === 'g' || e.key === 'c') {
      return;
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: mcp change every render
  useEffect(() => {
    document.addEventListener('keydown', modelMCPHandler);

    return () => {
      document.removeEventListener('keydown', modelMCPHandler);
    };
  }, []);

  // biome-ignore lint/style/useBlockStatements: useless
  if (!editor) return null;

  return (
    <EditorContent
      className={cn('w-full cursor-text text-sm!', className)}
      editor={editor}
      onClick={() => {
        editor.commands.focus();
      }}
    />
  );
});
