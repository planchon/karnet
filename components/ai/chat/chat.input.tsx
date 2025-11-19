"use client";

import { useUploadFile } from "@convex-dev/r2/react";
import Document from "@tiptap/extension-document";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import { Button } from "@ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { Shortcut } from "@ui/shortcut";
import { useMutation } from "convex/react";
import { GlobeIcon, GlobeLockIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { ProviderIcons } from "@/ai/models";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { isImageGeneratingModel } from "@/ai/schema/model";
import { api } from "@/convex/_generated/api";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { useStores } from "@/hooks/useStores";
import { capitalize, cn } from "@/lib/utils";
import { RewriteEnter } from "./extensions/enter";
import { ModelSuggestionComponent } from "./extensions/model-suggestion";
import { renderItems } from "./extensions/textual-commands";
import { ToolsSuggestionComponent } from "./extensions/tools-suggestion";

export const ChatModelSelect = observer(function ChatModelSelectInner({
    editorRef,
}: {
    editorRef: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();
    const [open, setOpen] = useState(false);
    const { models } = useModels();

    useHotkeys(
        "m",
        () => {
            setOpen(true);
            chatStore.setDropdownOpen(true);
        },
        {
            preventDefault: true,
            useKey: true,
        }
    );

    function focusEditor() {
        if (!editorRef.current?.isFocused) {
            editorRef.current?.commands.focus();
        }
    }

    function handleSelect(value: KarnetModel) {
        chatStore.setModel(value);
        setOpen(false);
        chatStore.setDropdownOpen(false);
        focusEditor();
    }

    function toggleDropdown(isOpen: boolean) {
        setOpen(isOpen);
        chatStore.setDropdownOpen(isOpen);
        if (!isOpen) {
            focusEditor();
        }
    }

    const groupedByProvider = models
        .filter((model) => model.active)
        .reduce(
            (acc, model) => {
                acc[model.provider] = acc[model.provider] || [];
                acc[model.provider].push(model);
                return acc;
            },
            {} as Record<string, KarnetModel[]>
        );

    const defaultModel = models.find((model) => model.default && chatStore.canUseModel(model));

    return (
        <Popover onOpenChange={toggleDropdown} open={open}>
            <PopoverTrigger asChild className="outline-none ring-0">
                <Button className="h-6 px-2 text-gray-700 outline-none ring-0" size="sm" variant="ghost">
                    <ProviderIcons provider={chatStore.selectedModel?.provider || defaultModel?.provider || ""} />
                    {chatStore.selectedModel ? chatStore.selectedModel.name : defaultModel?.name || "No model selected"}
                    <Shortcut shortcut={["M"]} />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-full p-0"
                onEscapeKeyDown={(e) => {
                    toggleDropdown(false);
                    e.stopPropagation();
                }}
                side="top"
            >
                <Command>
                    <CommandInput placeholder="Search model..." />
                    <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
                        <CommandEmpty>No model found.</CommandEmpty>
                        {Object.entries(groupedByProvider).map(([provider, providerModels]) => (
                            <CommandGroup className="py-0" heading={capitalize(provider)} key={provider}>
                                {providerModels.map((m) => (
                                    <CommandItem key={m.id} onSelect={() => handleSelect(m)} value={m.id}>
                                        <ProviderIcons provider={provider} />
                                        {m.name}
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

export const ChatMCPSelect = observer(function ChatMcpSelectInner({
    editorRef: _editorRef,
}: {
    editorRef: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();

    const isDisabled = isImageGeneratingModel(chatStore.selectedModel);
    const isSelected = chatStore.selectedTool.includes("web");
    const SearchIcon = isSelected ? <GlobeIcon className="size-4" /> : <GlobeLockIcon className="size-4" />;

    return (
        <div className="relative flex items-center">
            <Button
                className={cn(
                    "h-7 rounded-full px-2 text-gray-600 outline-none ring-0 transition-all duration-100 hover:cursor-pointer hover:bg-gray-200/60",
                    chatStore.selectedTool.includes("web") && "bg-gray-200 text-gray-800"
                )}
                disabled={isDisabled}
                onClick={() => {
                    chatStore.toggleTool("web");
                }}
                size="sm"
                variant="ghost"
            >
                {SearchIcon}
                Search
            </Button>
        </div>
    );
});

export const ChatInput = observer(function ChatInputInside({
    className,
    onChange,
    ref,
}: {
    className?: string;
    onChange?: (value: string) => void;
    ref?: React.RefObject<Editor | null>;
}) {
    const { chatStore } = useStores();
    const uploadFile = useUploadFile(api.functions.files);
    const assignFile = useMutation(api.functions.files.assignFileToUser);

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            Document.configure({
                HTMLAttributes: {
                    class: "text-sm!",
                },
            }),
            Paragraph.configure({
                HTMLAttributes: {
                    class: "min-h-4 mt-0",
                    // the tailwind text-sm! is not working here
                    style: "font-size: 13px;",
                },
            }),
            Text.configure({
                HTMLAttributes: {
                    class: "text-sm! min-h-4",
                },
            }),
            Placeholder.configure({
                placeholder: "use / for commands and @ for entities",
            }),
            Mention.configure({
                suggestions: [
                    {
                        char: "/",
                        render: () =>
                            renderItems(
                                ToolsSuggestionComponent,
                                (props: { id?: ChatMessageBody["tools"][number] }) => {
                                    if (!props.id) {
                                        return;
                                    }
                                    chatStore.toggleTool(props.id);
                                }
                            ),
                    },
                    {
                        char: "@",
                        render: () =>
                            renderItems(ModelSuggestionComponent, (props: { model?: KarnetModel }) => {
                                if (!props.model) {
                                    return;
                                }
                                chatStore.setModel(props.model);
                            }),
                    },
                ],
            }),
            RewriteEnter,
        ],
        autofocus: "start",
        content: "",
        editorProps: {
            attributes: {
                style: "font-size: 13px;",
            },
            handlePaste: (_view, event) => {
                // check if the paste is an image
                if (event?.clipboardData?.files?.length && event.clipboardData.files.length > 0) {
                    const file = event.clipboardData?.files[0];
                    if (file) {
                        chatStore.addFiles([{ file, upload: "in_progress" }]);

                        uploadFile(file).then(async (id) => {
                            // move to the convex id
                            const { url, id: cid } = await assignFile({
                                id,
                                media_type: file.type,
                                filename: file.name,
                            });
                            chatStore.updateFile({ file, upload: "success" as const, id: cid, url });
                        });
                    }
                    return true;
                }
            },
        },
        onUpdate: ({ editor: e }) => {
            const text = e.getText();
            onChange?.(text);
        },
    });

    // @ts-expect-error
    useImperativeHandle(ref, () => editor);

    useHotkeys(
        "esc",
        () => {
            if (!editor) return;
            if (!editor?.isFocused) return;
            if (editor.getText() !== "") return;
            editor.commands.blur();
        },
        {
            enableOnContentEditable: true,
        }
    );

    // État pour suivre l'index dans l'historique
    const historyIndexRef = useRef<number>(-1);
    const isNavigatingRef = useRef<boolean>(false);
    const lastNavigatedContentRef = useRef<string>("");

    useEffect(() => {
        // Charger l'historique depuis localStorage
        const getHistory = (): string[] => {
            const historyStr = localStorage.getItem("chat-history-array");
            let history: string[] = historyStr ? JSON.parse(historyStr) : [];

            // Migration depuis l'ancien format (compatibilité)
            if (history.length === 0) {
                const oldHistory = localStorage.getItem("chat-history");
                if (oldHistory) {
                    history = [oldHistory];
                    localStorage.setItem("chat-history-array", JSON.stringify(history));
                }
            }

            return history;
        };

        const handleHistoryNavigation = (e: KeyboardEvent) => {
            if (!editor?.isFocused) return;

            const history = getHistory();
            if (history.length === 0) return;

            const currentText = editor.getText();

            // Vérifier si le contenu actuel correspond à un élément de l'historique
            const currentIndexInHistory = history.indexOf(currentText);
            const isCurrentlyInHistory = currentIndexInHistory !== -1;

            // Si on est en train de naviguer mais le contenu ne correspond plus à l'historique,
            // c'est que l'utilisateur a modifié le contenu, arrêter la navigation
            if (isNavigatingRef.current && !isCurrentlyInHistory && currentText !== lastNavigatedContentRef.current) {
                isNavigatingRef.current = false;
                historyIndexRef.current = -1;
            }

            // Ne gérer que les flèches haut/bas
            if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
                return;
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();

                // Si on n'est pas encore en train de naviguer, commencer depuis le dernier
                if (!isNavigatingRef.current) {
                    // Sauvegarder le contenu actuel comme point de départ
                    lastNavigatedContentRef.current = currentText;
                    isNavigatingRef.current = true;

                    // Si le contenu actuel est dans l'historique, commencer depuis là
                    if (isCurrentlyInHistory) {
                        historyIndexRef.current = currentIndexInHistory;
                        // Si on est déjà au début, ne rien faire
                        if (historyIndexRef.current === 0) {
                            return;
                        }
                        // Sinon, aller au précédent
                        historyIndexRef.current -= 1;
                    } else {
                        // Sinon, commencer depuis le dernier
                        historyIndexRef.current = history.length - 1;
                    }
                } else if (historyIndexRef.current > 0) {
                    // Naviguer vers le précédent
                    historyIndexRef.current -= 1;
                } else {
                    // Déjà au début, ne rien faire
                    return;
                }

                const prompt = history[historyIndexRef.current];
                if (prompt) {
                    editor.commands.setContent(prompt);
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();

                // Si on n'est pas en train de naviguer, ne rien faire
                if (!isNavigatingRef.current) {
                    return;
                }

                if (historyIndexRef.current < history.length - 1) {
                    // Naviguer vers le suivant
                    historyIndexRef.current += 1;
                    const prompt = history[historyIndexRef.current];
                    if (prompt) {
                        editor.commands.setContent(prompt);
                    }
                } else {
                    // On est à la fin, restaurer le contenu original ou vider
                    isNavigatingRef.current = false;
                    historyIndexRef.current = -1;
                    editor.commands.setContent(lastNavigatedContentRef.current);
                    lastNavigatedContentRef.current = "";
                }
            }
        };

        // Réinitialiser la navigation quand l'utilisateur envoie le message (Enter)
        const handleEnter = (e: KeyboardEvent) => {
            if (!editor?.isFocused) return;
            if (e.key === "Enter" && !e.shiftKey) {
                isNavigatingRef.current = false;
                historyIndexRef.current = -1;
                lastNavigatedContentRef.current = "";
            }
        };

        // Détecter les modifications du contenu pour arrêter la navigation si nécessaire
        const handleContentChange = () => {
            if (!editor) return;
            if (!isNavigatingRef.current) return;

            const currentText = editor.getText();
            const history = getHistory();
            const isCurrentlyInHistory = history.some((h) => h === currentText);

            // Si le contenu ne correspond plus à l'historique et n'est pas le contenu original,
            // c'est que l'utilisateur a modifié, arrêter la navigation
            if (!isCurrentlyInHistory && currentText !== lastNavigatedContentRef.current) {
                isNavigatingRef.current = false;
                historyIndexRef.current = -1;
            }
        };

        document.addEventListener("keydown", handleHistoryNavigation);
        document.addEventListener("keydown", handleEnter);

        if (editor) {
            editor.on("update", handleContentChange);
        }

        return () => {
            document.removeEventListener("keydown", handleHistoryNavigation);
            document.removeEventListener("keydown", handleEnter);
            if (editor) {
                editor.off("update", handleContentChange);
            }
        };
    }, [editor]);

    useEffect(() => {
        const modelMcpHandler = (e: KeyboardEvent) => {
            if (editor?.isFocused) {
                return;
            }

            if (e.key === "g" || e.key === "c") {
                return;
            }
        };

        document.addEventListener("keydown", modelMcpHandler);

        return () => {
            document.removeEventListener("keydown", modelMcpHandler);
        };
    }, [editor]);

    if (!editor) return null;

    return (
        <EditorContent
            className={cn("h-auto w-full cursor-text text-sm!", className)}
            editor={editor}
            onClick={() => {
                editor.commands.focus();
            }}
        />
    );
});
