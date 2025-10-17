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
import { useCallback, useEffect, useMemo } from "react";
import type { Id } from "@/convex/_generated/dataModel";
import { useDocumentOnce } from "@/hooks/useDocument";

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
    const { data: sketch, updateData: updateDocument } = useDocumentOnce({
        args: {
            smallId: id,
            type: "sketch",
        },
        options: {
            isLocallyStored: true,
        },
    });

    const store = useMemo(() => createTLStore(), []);

    useEffect(() => {
        if (sketch) {
            loadSnapshot(store, JSON.parse(sketch.data) as unknown as TLEditorSnapshot);
        }
    }, [sketch]);

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
