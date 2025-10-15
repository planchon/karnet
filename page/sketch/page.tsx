"use client";

import { convexQuery } from "@convex-dev/react-query";
import { Excalidraw } from "@excalidraw/excalidraw";
import type { ExcalidrawInitialDataState, ExcalidrawProps } from "@excalidraw/excalidraw/types";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";
import "@excalidraw/excalidraw/index.css";
import type { OrderedExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import { useConvex, useMutation } from "convex/react";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";

const SketchHeader = observer(function SketchHeaderInner() {
    const { sketchId } = useParams<{ sketchId: string }>();
    const { data: sketch } = useQuery({
        ...convexQuery(api.functions.documents.getDocumentBySmallId, {
            smallId: sketchId ?? "",
            type: "sketch",
        }),
    });

    const updateDocument = useMutation(api.functions.documents.updateDocument).withOptimisticUpdate(
        (localStore, args) => {
            const { title } = args;
            const current = localStore.getQuery(api.functions.documents.getDocumentBySmallId, {
                smallId: sketchId ?? "",
                type: "sketch",
            });
            if (current && sketchId && title) {
                localStore.setQuery(
                    api.functions.documents.getDocumentBySmallId,
                    {
                        smallId: sketchId,
                        type: "sketch",
                    },
                    {
                        ...current,
                        title,
                    }
                );
            }
        }
    );

    if (!sketch) {
        return null;
    }

    return (
        <div className="flex h-10 w-full items-center justify-between border-b">
            <div className="flex h-full select-none flex-row items-center justify-center gap-2 pl-4">
                <Input
                    className={cn("w-full border-none font-medium focus:border-transparent focus:ring-0!")}
                    onChange={(e) => updateDocument({ id: sketch._id, title: e.target.value })}
                    placeholder="Drawing name"
                    value={sketch.title}
                />
                <div className="flex flex-row items-center gap-2 pl-2" />
            </div>
            <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
                <Button size="sm" variant="outline">
                    <IconAdjustmentsHorizontal className="size-3" />
                    <span className="text-xs">Infos</span>
                </Button>
            </div>
        </div>
    );
});

export const SketchPage = observer(function DrawPage() {
    const { sketchId } = useParams<{ sketchId: string }>();
    const [sketchData, setSketchData] = useState<Doc<"documents"> | null>(null);
    const convex = useConvex();
    const updateDocument = useMutation(api.functions.documents.updateDocument);

    useEffect(() => {
        if (!sketchData) {
            const initialData = JSON.parse(localStorage.getItem(`sketch:${sketchId}`) || "null");
            if (initialData) {
                setSketchData(initialData);
            }
        }

        if (!sketchId) {
            console.error("No sketch id");
            return;
        }

        convex
            .query(api.functions.documents.getDocumentBySmallId, {
                smallId: sketchId,
                type: "sketch",
            })
            .then((sketch) => {
                setSketchData(sketch);
                // data is already a string
                localStorage.setItem(`sketch:${sketchId}`, sketch.data);
            });
    }, [sketchId]);

    const saveDocumentToServer = useCallback(
        debounce(
            (el: readonly OrderedExcalidrawElement[]) => {
                if (!sketchData?._id) {
                    console.error("No sketch id while saving to server");
                    return;
                }

                updateDocument({
                    id: sketchData?._id,
                    data: JSON.stringify(el),
                });
            },
            2500,
            {
                trailing: true,
            }
        ),
        [sketchData?._id]
    );

    if (!sketchData) {
        return <div>Loading...</div>;
    }

    const onExcalidrawChange: ExcalidrawProps["onChange"] = debounce(
        (elements: readonly OrderedExcalidrawElement[]) => {
            localStorage.setItem(`sketch:${sketchId}`, JSON.stringify(elements));
            saveDocumentToServer(elements);
        },
        1000,
        {
            trailing: true,
        }
    );

    const data: ExcalidrawInitialDataState = {
        elements: sketchData.data ? JSON.parse(sketchData.data) : [],
    };

    return (
        <div className="h-full w-full">
            <SketchHeader />
            <div className="h-[calc(100%-40px)] w-full">
                <Excalidraw initialData={data} onChange={onExcalidrawChange} />
            </div>
        </div>
    );
});
