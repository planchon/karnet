"use client";

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
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/tooltip";
import { useConvex, useMutation } from "convex/react";
import { GlobeIcon, GlobeLockIcon } from "lucide-react";
import { observer } from "mobx-react";
import { nanoid } from "nanoid";
import { useEffect, useImperativeHandle, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { LuScanText } from "react-icons/lu";
import { MdOutlineImage, MdOutlineImageNotSupported } from "react-icons/md";
import { ProviderIcons } from "@/ai/models";
import type { ChatMessageBody } from "@/ai/schema/chat";
import { api } from "@/convex/_generated/api";
import { type KarnetModel, useModels } from "@/hooks/useModels";
import { useStores } from "@/hooks/useStores";
import { capitalize, cn } from "@/lib/utils";
import { RewriteEnter } from "./extensions/enter";
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

    const onlyImageModels = chatStore.selectedTool.includes("image");

    const groupedByProvider = models
        .filter((model) => model.active)
        .filter((model) => {
            if (onlyImageModels) {
                return model.architecture.output_modalities.includes("image");
            }
            return !model.architecture.output_modalities.includes("image");
        })
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
                    <CommandInput placeholder={onlyImageModels ? "Search image model..." : "Search text model..."} />
                    <CommandList className="scrollbar-thin max-h-48 overflow-y-auto">
                        <CommandEmpty className="px-2 py-6 text-center text-sm">
                            You don't have any model activated. <br /> (you can activate them in the settings)
                        </CommandEmpty>
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

    const isSelected = chatStore.selectedTool.includes("web");
    const SearchIcon = isSelected ? <GlobeIcon className="size-4" /> : <GlobeLockIcon className="size-4" />;

    const isImageSelected = chatStore.selectedTool.includes("image");
    const ImageIcon = isImageSelected ? (
        <MdOutlineImage className="size-4" />
    ) : (
        <MdOutlineImageNotSupported className="size-4" />
    );

    return (
        <div className="relative flex items-center">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(
                            "h-7 rounded-full px-2 text-gray-600 outline-none ring-0 transition-all duration-100 hover:cursor-pointer hover:bg-gray-200/60",
                            chatStore.selectedTool.includes("ocr") && "bg-gray-200 text-gray-800",
                            !chatStore.canUseOCR() && "cursor-none opacity-50 hover:cursor-default hover:bg-transparent"
                        )}
                        onClick={() => {
                            if (!chatStore.canUseOCR()) return;

                            chatStore.toggleTool("ocr");
                        }}
                        size="sm"
                        variant="ghost"
                    >
                        <LuScanText className="size-4" />
                        Mistral OCR
                    </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                    <span>
                        Use Mistral OCR
                        {!chatStore.canUseOCR() && ", (disabled because no PDF files attached)"}
                    </span>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(
                            "h-7 rounded-full px-2 text-gray-600 outline-none ring-0 transition-all duration-100 hover:cursor-pointer hover:bg-gray-200/60",
                            chatStore.selectedTool.includes("image") && "bg-gray-200 text-gray-800"
                        )}
                        onClick={() => {
                            chatStore.toggleTool("image");
                        }}
                        size="sm"
                        variant="ghost"
                    >
                        {ImageIcon}
                        Image
                    </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                    <span>Generate images</span>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        className={cn(
                            "h-7 rounded-full px-2 text-gray-600 outline-none ring-0 transition-all duration-100 hover:cursor-pointer hover:bg-gray-200/60",
                            chatStore.selectedTool.includes("web") && "bg-gray-200 text-gray-800"
                        )}
                        disabled={!chatStore.canSearchWeb()}
                        onClick={() => {
                            chatStore.toggleTool("web");
                        }}
                        size="sm"
                        variant="ghost"
                    >
                        {SearchIcon}
                        Search
                    </Button>
                </TooltipTrigger>
                <TooltipContent sideOffset={5}>
                    <span>Enable web search</span>
                </TooltipContent>
            </Tooltip>
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
    const generateImageUploadUrl = useMutation(api.functions.files.generateImageUploadUrl);
    const client = useConvex();

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
                placeholder: "ask anything, use / for commands",
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
                    const inputFile = event.clipboardData?.files[0];
                    const file = new File([inputFile], `${nanoid()}.${inputFile.name.split(".").pop()}`, {
                        type: inputFile.type,
                    });
                    if (file) {
                        chatStore.addFiles([{ file, upload: "in_progress" }]);

                        (async () => {
                            const uploadUrl = await generateImageUploadUrl({});
                            const uploadResponse = await fetch(uploadUrl, {
                                method: "POST",
                                headers: {
                                    "Content-Type": file.type,
                                },
                                body: file,
                            });
                            const { storageId } = await uploadResponse.json();
                            const { url } = await client.query(api.functions.files.getImageUrl, { id: storageId });
                            if (!url) {
                                console.error("error getting image url", storageId);
                                return;
                            }

                            chatStore.updateFile({ file, upload: "success" as const, id: storageId, url });
                        })();
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
            const historyStr = localStorage.getItem("chat-history");
            let historyArray: string[] = [];

            try {
                historyArray = historyStr ? JSON.parse(historyStr) : [];
            } catch (error) {
                console.error("error parsing history", error);
                localStorage.removeItem("chat-history");
                historyArray = [];
            }

            return historyArray;
        };

        const handleHistoryNavigation = (e: KeyboardEvent) => {
            if (!editor?.isFocused) return;
            if (chatStore.toolDropdownOpen) return;

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
            if (chatStore.toolDropdownOpen) return;

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
