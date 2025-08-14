import { Anthropic, Gemini, OpenAI } from '@lobehub/icons';
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
import { useEffect, useRef, useState } from 'react';

export const modelSuggestion = [
  {
    group: 'OpenAI',
    items: [
      {
        title: 'GPT 4o',
        searchTerms: ['gpt-4o'],
        icon: OpenAI,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
      {
        title: 'GPT 4o Mini',
        searchTerms: ['gpt-4o-mini'],
        icon: OpenAI,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
      {
        title: 'GPT 5',
        searchTerms: ['gpt-5'],
        icon: OpenAI,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
    ],
  },
  {
    group: 'Anthropic',
    items: [
      {
        title: 'Claude 3.5 Sonnet',
        searchTerms: ['claude'],
        icon: Anthropic,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
      {
        title: 'Claude 4 Opus',
        searchTerms: ['claude 4 opus'],
        icon: Anthropic,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
      {
        title: 'Claude 4.1 Opus',
        searchTerms: ['claude 4.1 opus'],
        icon: Anthropic,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
    ],
  },
  {
    group: 'Google',
    items: [
      {
        title: 'Gemini 2.0 Flash',
        searchTerms: ['gemini 2.0 flash'],
        icon: Gemini,
        command: ({ editor, range }: { editor: Editor; range: Range }) => {
          editor.chain().focus().deleteRange(range).run();
        },
      },
    ],
  },
];

export const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

interface ModelSuggestionComponentProps {
  query: string;
  range: Range;
  editor: Editor;
}

export const ModelSuggestionComponent = (
  props: ModelSuggestionComponentProps
) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const onChange = (q: string) => {
    setQuery(q);
  };

  useEffect(() => {
    setQuery(props.query);
  }, [props.query]);

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
        {modelSuggestion.map((model, index) => (
          <CommandGroup
            heading={model.group}
            key={model.group}
            value={model.group}
          >
            {model.items.map((item) => (
              <CommandItem
                key={item.title}
                onSelect={() => {
                  item.command({ editor: props.editor, range: props.range });
                }}
                value={item.title}
              >
                <item.icon />
                {item.title}
              </CommandItem>
            ))}
            {index !== modelSuggestion.length - 1 && (
              <CommandSeparator className="mt-1" />
            )}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
