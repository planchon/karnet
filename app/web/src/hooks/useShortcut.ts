import { CommandsModels } from "@/models/command.model";
import {
  useCallback,
  useRef,
  useLayoutEffect,
  useState,
  useEffect
} from "react";
import { useNavigate } from "react-router";

export const useShortcut = (
  shortcut: string,
  callback: (event: KeyboardEvent) => void,
  options = { disableTextInputs: true }
) => {
  const callbackRef = useRef(callback);
  const [keyCombo, setKeyCombo] = useState<string[]>([]);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyDown = useCallback(
    // the bypass is used in the rich text editor
    (event: KeyboardEvent & { bypassTextInput?: boolean }) => {
      const isTextInput =
        event.target instanceof HTMLTextAreaElement ||
        (event.target instanceof HTMLInputElement &&
          (!event.target.type || event.target.type === "text")) ||
        (event.target as HTMLTextAreaElement).isContentEditable;

      const modifierMap = {
        Control: event.ctrlKey,
        Alt: event.altKey,
        Command: event.metaKey,
        Shift: event.shiftKey
      };

      function getModifier(key: string) {
        return modifierMap[key as keyof typeof modifierMap];
      }

      // Cancel shortcut if key is being held down
      if (event.repeat) {
        return null;
      }

      if (shortcut === "n" && event.key === "n" && !isTextInput) {
        event.preventDefault();
      }

      // Don't enable shortcuts in inputs unless explicitly declared
      if (options.disableTextInputs && isTextInput && !event.bypassTextInput) {
        return event.stopPropagation();
      }

      // Handle combined modifier key shortcuts (e.g. pressing Control + D)
      if (shortcut.includes("+")) {
        const keyArray = shortcut.split("+");

        if (!keyArray[0]) {
          return;
        }

        // If the first key is a modifier, handle combinations
        if (Object.keys(modifierMap).includes(keyArray[0])) {
          const finalKey = keyArray.pop();

          // Run handler if the modifier(s) + key have both been pressed
          if (keyArray.every((k) => getModifier(k)) && finalKey === event.key) {
            event.preventDefault();
            return callbackRef.current(event);
          }
        } else {
          // If the shortcut doesn't begin with a modifier, it's a sequence
          if (keyArray[keyCombo.length] === event.key) {
            // Handle final key in the sequence
            if (
              keyArray[keyArray.length - 1] === event.key &&
              keyCombo.length === keyArray.length - 1
            ) {
              // Run handler if the sequence is complete, then reset it
              callbackRef.current(event);
              event.stopPropagation();
              event.preventDefault();
              return setKeyCombo([]);
            }

            // Add to the sequence
            return setKeyCombo((prevCombo) => [...prevCombo, event.key]);
          }
          if (keyCombo.length > 0) {
            // Reset key combo if it doesn't match the sequence
            return setKeyCombo([]);
          }
        }
      }

      // Single key shortcuts (e.g. pressing D)
      if (shortcut === event.key) {
        event.stopPropagation();
        return callbackRef.current(event);
      }
    },
    [keyCombo.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
};

export const useLinkShortcut = (shortcut: string, link: string) => {
  const navigate = useNavigate();

  useShortcut(shortcut, () => {
    navigate(link);
  });
};

let __commandSingleton: CommandsModels | null = null;

if (!__commandSingleton) {
  __commandSingleton = new CommandsModels({});
}

export const useCommands = () => {
  return __commandSingleton;
};
