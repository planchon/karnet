"use client";

import { convexQuery } from "@convex-dev/react-query";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { Navigate, useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { cn, slugify } from "@/lib/utils";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";
import "@excalidraw/excalidraw/index.css";
import { Draw } from "@draw/draw";
import { useMutation } from "convex/react";

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
                // change the url to the new slug
                window.history.replaceState({}, "", `/sketch/${sketchId}/${slugify(title)}`);
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

    if (!sketchId) {
        return <Navigate to="/document" />;
    }

    return (
        <div className="h-full w-full">
            <SketchHeader />
            <div className="h-[calc(100%-40px)] w-full">
                <Draw id={sketchId} />
            </div>
        </div>
    );
});
