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
import { models } from '@/data/model';

export const navigationKeys = ['ArrowUp', 'ArrowDown', 'Enter'];

interface ModelSuggestionComponentProps {
  query: string;
  range: Range;
  editor: Editor;
  callback: (props: { id: string }) => void;
}

export const ModelSuggestionComponent = (
  props: ModelSuggestionComponentProps
) => {
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  const callback = props.callback;

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

  const handleSelect = (id: string) => {
    props.editor.chain().focus().deleteRange(props.range).run();
    callback({
      id,
    });
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
        {models.map((provider, index) => (
          <CommandGroup
            heading={provider.providerName}
            key={provider.providerID}
            value={provider.providerID}
          >
            {provider.models.map((model) => (
              <CommandItem
                key={model.id}
                onSelect={() => handleSelect(model.id)}
                value={model.id}
              >
                <model.icon />
                {model.name}
              </CommandItem>
            ))}
            {index !== models.length - 1 && (
              <CommandSeparator className="mt-1" />
            )}
          </CommandGroup>
        ))}
      </CommandList>
    </Command>
  );
};
