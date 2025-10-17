"use client";

import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react";
import { useParams } from "react-router";
import DiagramEditor from "@/components/diagram/diagram.comp";
import { api } from "@/convex/_generated/api";

export const DiagramPage = observer(function DiagramPageInner() {
    const { diagramId } = useParams<{ diagramId: string }>();

    const { data: diagram } = useQuery({
        ...convexQuery(api.functions.documents.getDocumentBySmallId, {
            smallId: diagramId ?? "",
            type: "diagram",
        }),
        initialData: JSON.parse(localStorage.getItem(`diagram:${diagramId}`) || "null"),
    });

    if (!(diagramId && diagram)) {
        return null;
    }

    return <DiagramEditor diagram={diagram} />;
});
