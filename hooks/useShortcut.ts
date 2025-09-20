'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { CommandsModels } from '@/models/command.model';

export const useShortcut = (
    shortcut: string,
    callback: (event: KeyboardEvent) => void,
    options = { disableTextInputs: true, capture: true }
) => {
    const callbackRef = useRef(callback);
    const [keyCombo, setKeyCombo] = useState<string[]>([]);

    useLayoutEffect(() => {
        callbackRef.current = callback;
    });

    const handleKeyDown = useCallback(
        // the bypass is used in the rich text editor
        // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: its ok
        (event: KeyboardEvent & { bypassTextInput?: boolean }) => {
            const isTextInput =
                event.target instanceof HTMLTextAreaElement ||
                (event.target instanceof HTMLInputElement && (!event.target.type || event.target.type === 'text')) ||
                (event.target as HTMLTextAreaElement).isContentEditable;

            const modifierMap = {
                Control: event.ctrlKey,
                Alt: event.altKey,
                Command: event.metaKey,
                Shift: event.shiftKey,
            };

            function getModifier(key: string) {
                return modifierMap[key as keyof typeof modifierMap];
            }

            // Cancel shortcut if key is being held down
            if (event.repeat) {
                return null;
            }

            if (shortcut === 'n' && event.key === 'n' && !isTextInput) {
                event.preventDefault();
            }

            // Don't enable shortcuts in inputs unless explicitly declared
            if (
                options.disableTextInputs &&
                isTextInput &&
                !event.bypassTextInput &&
                shortcut !== 'Control+Enter' &&
                shortcut !== 'Command+Enter'
            ) {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape'].includes(event.key)) {
                    return;
                }
                return event.stopPropagation();
            }

            // Handle combined modifier key shortcuts (e.g. pressing Control + D)
            if (shortcut.includes('+')) {
                const keyArray = shortcut.split('+');

                if (!keyArray[0]) {
                    return;
                }

                // If the first key is a modifier, handle combinations
                if (Object.keys(modifierMap).includes(keyArray[0])) {
                    const finalKey = keyArray.pop();

                    // Run handler if the modifier(s) + key have both been pressed
                    if (keyArray.every((k) => getModifier(k)) && finalKey === event.key) {
                        event.preventDefault();
                        event.stopPropagation();
                        return callbackRef.current(event);
                    }
                } else {
                    // If the shortcut doesn't begin with a modifier, it's a sequence
                    if (keyArray[keyCombo.length] === event.key) {
                        // Handle final key in the sequence
                        if (keyArray.at(keyArray.length - 1) === event.key && keyCombo.length === keyArray.length - 1) {
                            // Run handler if the sequence is complete, then reset it
                            event.stopPropagation();
                            event.preventDefault();

                            callbackRef.current(event);
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
        [keyCombo.length, options.disableTextInputs, shortcut]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown, options.capture);

        return () => {
            window.removeEventListener('keydown', handleKeyDown, options.capture);
        };
    }, [handleKeyDown, options.capture]);
};

export const useLinkShortcut = (shortcut: string, link: string) => {
    const router = useNavigate();

    useShortcut(shortcut, () => {
        router(link);
    });
};

let __commandSingleton: CommandsModels | null = null;

if (!__commandSingleton) {
    __commandSingleton = new CommandsModels({});
}

export const useCommands = () => {
    return __commandSingleton;
};
