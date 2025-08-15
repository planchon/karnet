import type { Editor, Range } from '@tiptap/react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@ui/command';
import { Command as Cmd } from 'cmdk';
import React, { useEffect, useState } from 'react';
import { FaImage, FaInternetExplorer, FaReact } from 'react-icons/fa';
import { commands } from '@/data/tools';

export const ToolsSuggestion = [
  {
    group: 'Search',
    items: [
      {
        title: 'Web',
        icon: FaInternetExplorer,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
      {
        title: 'Image',
        icon: FaImage,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
    ],
  },
  {
    group: 'MCP',
    items: [
      {
        title: 'React',
        icon: FaReact,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
    ],
  },
];

export const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

interface ToolsSuggestionComponentProps {
  query: string;
  range: Range;
  editor: Editor;
}

export const ToolsSuggestionComponent = (
  props: ToolsSuggestionComponentProps
) => {
  const [query, setQuery] = useState('');
  const ref = React.useRef<HTMLDivElement>(null);

  const onChange = (q: string) => {
    setQuery(q);
  };

  useEffect(() => {
    console.log('query', props.query);
    setQuery(props.query);
  }, [props.query]);

  useEffect(() => {
    console.log('range', props.range);
  }, [props.range]);

  useEffect(() => {
    const abortController = new AbortController();

    document.addEventListener(
      'keydown',
      (event) => {
        if (navigationKeys.includes(event.key)) {
          // prevent default behavior of the key
          event.preventDefault();

          if (ref.current) {
            // dispatch the keydown event to the slash command
            ref.current.dispatchEvent(
              new KeyboardEvent('keydown', {
                key: event.key,
                cancelable: true,
                bubbles: true,
              })
            );

            return false;
          }
        }
      },
      {
        signal: abortController.signal,
      }
    );

    return () => {
      abortController.abort();
    };
  }, []);

  const handleSelect = () => {
    props.editor.chain().focus().deleteRange(props.range).run();
  };

  return (
    <Command
      className="min-w-[200px] border"
      onKeyDown={(e) => e.stopPropagation()}
      ref={ref}
    >
      <Cmd.Input
        onValueChange={onChange}
        style={{ display: 'none' }}
        value={query}
      />
      <CommandEmpty>No results.</CommandEmpty>
      <CommandList className="scrollbar-thin max-h-[300px] overflow-y-auto">
        {commands.map((tool, index) => (
          <CommandGroup heading={tool.name} key={tool.name} value={tool.name}>
            {tool.tools.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={handleSelect}
                value={item.id}
              >
                <item.icon />
                {item.name}
              </CommandItem>
            ))}
            {index !== commands.length - 1 && (
              <CommandSeparator className="mt-1" />
            )}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
