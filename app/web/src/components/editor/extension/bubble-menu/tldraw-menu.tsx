import { BubbleMenu, Editor, useEditorState } from "@tiptap/react";
import { cn } from "@/lib/utils";
import { useStores } from "@/hooks/useStores";
import { observer } from "mobx-react";
import { Popover, PopoverTrigger, PopoverContent } from "@ui/popover";
import { IconChevronDown } from "@tabler/icons-react";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Command
} from "@ui/command";
import { Button } from "@ui/button";
import { useCallback } from "react";

export const SketchMenu = ({ editor }: { editor: Editor }) => {
  const { sketchesStore } = useStores();

  const state = useEditorState({
    editor,
    selector: (state) => {
      const selectedContent = state.editor.state.selection
        .content()
        .content.toJSON();

      if (selectedContent && selectedContent.length == 1) {
        const node = selectedContent[0];
        if (node.type === "tldraw") {
          return { id: node.attrs["id"] };
        }
      }

      return {};
    }
  });

  const shouldShow = useCallback(() => {
    return editor.isActive("tldraw");
  }, [editor]);

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 0 }}
      shouldShow={shouldShow}
      updateDelay={0}
      pluginKey="tldrawMenu"
    >
      {state.id && (
        <div
          className={cn(
            "border-border bg-background w-fit rounded-lg border p-1 shadow"
          )}
        >
          <div className="flex flex-row items-center justify-center overflow-hidden rounded-md">
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="ghost"
                  role="combobox"
                  className="justify-between rounded-l-none"
                >
                  <span className="max-w-[100px] truncate">
                    {sketchesStore.getById(state.id)?.name}
                  </span>
                  <IconChevronDown />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mt-2 rounded-md border p-0 shadow">
                <Command defaultValue={sketchesStore.getById(state.id)?.name}>
                  <CommandInput placeholder="Search a sketch" />
                  <CommandList className="mb-0">
                    <CommandEmpty>No sketch found</CommandEmpty>
                    <CommandGroup>
                      {sketchesStore.allModels().map((sketch) => (
                        <CommandItem
                          key={sketch.name}
                          value={sketch.name}
                          onSelect={() => {
                            editor
                              .chain()
                              .focus()
                              .deleteCurrentNode()
                              .insertContent(
                                `<tldraw id="${sketch.id}"></tldraw>`
                              )
                              .run();
                          }}
                        >
                          {sketch.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </BubbleMenu>
  );
};
