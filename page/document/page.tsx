"use client";

import {
    IconChartDots3,
    IconCopy,
    IconFile,
    IconId,
    IconLink,
    IconPalette,
    IconPencil,
    IconPlus,
    IconStar,
    IconTrash,
} from "@tabler/icons-react";
import {
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
} from "@ui/context-menu";
import { useMutation, usePaginatedQuery } from "convex/react";
import { observer } from "mobx-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { View } from "@/components/view/table";
import { api } from "@/convex/_generated/api";
import { usePageTitle } from "@/hooks/usePageTitle";
import { slugify } from "@/lib/utils";
import { GenericView } from "@/view/generic.view";

export default observer(() => {
    usePageTitle("My Documents - Karnet AI Assistant");

    const navigate = useNavigate();

    const [viewModel, _] = useState(new GenericView());
    const { results: documents } = usePaginatedQuery(
        api.functions.documents.getUserDocuments,
        {},
        {
            initialNumItems: 500,
        }
    );
    const createEmptyDocument = useMutation(api.functions.documents.createEmptyDocument);
    const deleteDocument = useMutation(api.functions.documents.deleteDocument);

    return (
        <View.Root viewModel={viewModel}>
            <View.Header.Body>
                <View.Header.Title>Documents</View.Header.Title>
                <View.Header.Spacer />
                <View.Header.Search />
            </View.Header.Body>
            <View.Items.Root>
                {documents.map((doc) => (
                    <View.Items.Item item={doc} key={doc._id} listIndex={0}>
                        <View.Item.Line>
                            <View.Item.Infos>
                                <View.Item.Icon>
                                    {(() => {
                                        switch (doc.type) {
                                            case "paper":
                                                return <IconFile />;
                                            case "sketch":
                                                return <IconPalette />;
                                            default:
                                                return <IconChartDots3 />;
                                        }
                                    })()}
                                </View.Item.Icon>
                                <View.Item.SmallId />
                                {doc.title && (
                                    <div className="font-medium text-accent-foreground text-sm">{doc.title}</div>
                                )}
                                {!doc.title && (
                                    <div className="font-medium text-destructive text-sm">
                                        Untitled (please name me)
                                    </div>
                                )}
                            </View.Item.Infos>
                            <View.Item.Spacer />
                            <View.Item.Tags>
                                {/* <View.Item.Labels>
                                        <Label className="bg-background" icon={IconCalendar} label="test" />
                                    </View.Item.Labels> */}
                                <View.Item.Author />
                                <View.Item.Date />
                            </View.Item.Tags>
                            <View.Item.ContextMenu>
                                <ContextMenuItem>
                                    <IconPencil className="mr-2" />
                                    <span>Rename</span>
                                </ContextMenuItem>
                                <ContextMenuItem>
                                    <IconStar className="mr-2" />
                                    <span>Favorite</span>
                                </ContextMenuItem>
                                <ContextMenuSeparator />
                                <ContextMenuSub>
                                    <ContextMenuSubTrigger>
                                        <IconCopy className="mr-4" />
                                        <span>Copy</span>
                                    </ContextMenuSubTrigger>
                                    <ContextMenuSubContent>
                                        <ContextMenuItem>
                                            <IconId className="mr-2" />
                                            <span>Copy ID</span>
                                            <ContextMenuShortcut>
                                                <span>⌘.</span>
                                            </ContextMenuShortcut>
                                        </ContextMenuItem>
                                        <ContextMenuItem>
                                            <IconLink className="mr-2" />
                                            <span>Copy URL</span>
                                            <ContextMenuShortcut>
                                                <span>⌘L</span>
                                            </ContextMenuShortcut>
                                        </ContextMenuItem>
                                    </ContextMenuSubContent>
                                </ContextMenuSub>
                                <ContextMenuSeparator />
                                <ContextMenuItem
                                    onSelect={() => {
                                        deleteDocument({
                                            id: doc._id,
                                        });
                                    }}
                                >
                                    <IconTrash className="mr-2 text-destructive" />
                                    <span className="text-destructive">Delete</span>
                                </ContextMenuItem>
                            </View.Item.ContextMenu>
                        </View.Item.Line>
                    </View.Items.Item>
                ))}
                <View.Items.Menu>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>
                            <IconPlus className="mr-4" />
                            Create
                        </ContextMenuSubTrigger>
                        <ContextMenuSubContent className="w-40">
                            <ContextMenuItem asChild>
                                <button
                                    className="w-full"
                                    onClick={() => {
                                        createEmptyDocument({
                                            type: "paper",
                                        }).then((paperId) => {
                                            navigate(`/paper/${paperId.smallId}/${slugify(paperId.title)}`);
                                        });
                                    }}
                                    type="button"
                                >
                                    <IconFile className="mr-4" />
                                    Papers
                                </button>
                            </ContextMenuItem>
                            <ContextMenuItem asChild disabled>
                                <button
                                    className="w-full"
                                    onClick={() => {
                                        createEmptyDocument({
                                            type: "diagram",
                                        }).then((diagramId) => {
                                            navigate(`/diagram/${diagramId.smallId}/${slugify(diagramId.title)}`);
                                        });
                                    }}
                                    type="button"
                                >
                                    <IconChartDots3 className="mr-4" />
                                    Diagram
                                </button>
                            </ContextMenuItem>
                            <ContextMenuItem asChild>
                                <button
                                    className="w-full"
                                    onClick={() => {
                                        createEmptyDocument({
                                            type: "sketch",
                                        }).then((sketchId) => {
                                            navigate(`/sketch/${sketchId.smallId}/${slugify(sketchId.title)}`);
                                        });
                                    }}
                                    type="button"
                                >
                                    <IconPalette className="mr-4" />
                                    Sketch
                                </button>
                            </ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                </View.Items.Menu>
            </View.Items.Root>
        </View.Root>
    );
});
