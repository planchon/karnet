"use client";

import { throttle } from "lodash";
import {
    createTLStore,
    loadSnapshot,
    type TLEditorSnapshot,
    type TLUiComponents,
    type TLUiOverrides,
    Tldraw,
} from "tldraw";
import { Grid } from "./grid";
import { Toolbar } from "./toolbar";
import "tldraw/tldraw.css";
import { useConvex, useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";

const components: TLUiComponents & { Grid: typeof Grid } = {
    MenuPanel: null,
    Grid,
    Toolbar: Toolbar as TLUiComponents["Toolbar"],
};

type DrawProps = {
    id: string;
};
const overrides: TLUiOverrides = {
    actions(_editor, actions, _helpers) {
        const newActions = {
            ...actions,
            "toggle-grid": {
                ...actions["toggle-grid"],
                id: "toggle-grid",
                kbd: "Shift+G",
            },
        };

        return newActions;
    },
};

function Draw({ id }: DrawProps) {
    const convex = useConvex();
    const updateDocument = useMutation(api.functions.documents.updateDocument);
    const [sketch, setSketch] = useState<Doc<"documents"> | undefined>(undefined);
    const store = useMemo(() => createTLStore(), []);

    useEffect(() => {
        convex
            .query(api.functions.documents.getDocumentBySmallId, {
                smallId: id,
                type: "sketch",
            })
            .then((s) => {
                setSketch(s);
                try {
                    loadSnapshot(store, JSON.parse(s.data) as unknown as TLEditorSnapshot);
                } catch (error) {
                    console.error("Error loading snapshot", error);
                }
            });
    }, []);

    const onStoreChange = useCallback(() => {
        if (sketch) {
            const snapshot = store.getStoreSnapshot("document");
            updateDocument({ id: sketch._id as Id<"documents">, data: JSON.stringify(snapshot) });
        } else {
            console.error("Sketch not found");
        }
    }, [sketch]);

    useEffect(() => {
        const cleanUpFunction = store.listen(throttle(onStoreChange, 1000, { trailing: true }), {
            source: "user",
            scope: "document",
        });

        return () => {
            cleanUpFunction();
        };
    }, [sketch]);

    return (
        <div className="relative h-full w-full">
            <Tldraw
                components={components}
                onMount={(e) => {
                    e.user.updateUserPreferences({
                        isSnapMode: true,
                    });
                    e.updateInstanceState({
                        isGridMode: true,
                    });
                }}
                overrides={overrides}
                store={store}
            />
        </div>
    );
}

export { Draw };
