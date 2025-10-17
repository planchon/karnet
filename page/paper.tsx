"use client";

import { SimpleEditor } from "@editor/editor/editor";
import { IconAdjustmentsHorizontal } from "@tabler/icons-react";
import { observer } from "mobx-react";
import { Button } from "@/primitive/ui/button";
import { Input } from "@/primitive/ui/input";
import "@editor/styles/_variables.scss";
import "@editor/styles/_keyframe-animations.scss";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { slugify } from "@/lib/utils";

export const PaperPage = observer(function PaperPageInner() {
    const { paperId } = useParams<{ paperId: string }>();
    const { data: paper } = useQuery({
        ...convexQuery(api.functions.documents.getDocumentBySmallId, {
            smallId: paperId ?? "",
            type: "paper",
        }),
    });
    const updateDocument = useMutation(api.functions.documents.updateDocument).withOptimisticUpdate(
        (localStore, args) => {
            const { title } = args;
            const current = localStore.getQuery(api.functions.documents.getDocumentBySmallId, {
                smallId: paperId ?? "",
                type: "paper",
            });
            if (current && paperId && title) {
                localStore.setQuery(
                    api.functions.documents.getDocumentBySmallId,
                    {
                        smallId: paperId,
                        type: "paper",
                    },
                    {
                        ...current,
                        title,
                    }
                );
                // change the url to the new slug
                window.history.replaceState({}, "", `/paper/${paperId}/${slugify(title)}`);
            }
        }
    );

    if (!paperId) {
        return <div>No id</div>;
    }

    return (
        <div className="h-full w-full">
            <div className="flex h-10 w-full items-center justify-between border-b">
                <div className="flex h-full w-full select-none flex-row items-center justify-center gap-2 pl-4">
                    <Input
                        className="w-full border-none font-medium shadow-none focus:border-transparent focus:ring-0!"
                        onChange={(e) => updateDocument({ id: paper?._id as Id<"documents">, title: e.target.value })}
                        placeholder="Document name"
                        value={paper?.title}
                    />
                </div>
                <div className="flex h-full flex-row items-center justify-center gap-2 pr-4">
                    <Button size="sm" variant="outline">
                        <IconAdjustmentsHorizontal className="size-3" />
                        <span className="text-xs">Infos</span>
                    </Button>
                </div>
            </div>
            <SimpleEditor paperId={paperId} />
        </div>
    );
});
