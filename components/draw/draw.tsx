// "use client";

// import { throttle } from "lodash";
// import {
//     createTLStore,
//     type Editor,
//     getSnapshot,
//     loadSnapshot,
//     type TLEditorSnapshot,
//     type TLUiComponents,
//     type TLUiOverrides,
//     Tldraw,
//     useEditor,
// } from "tldraw";
// import { Grid } from "./grid";
// import { Toolbar } from "./toolbar";
// import "tldraw/tldraw.css";
// import { Excalidraw } from "@excalidraw/excalidraw";
// import type { ExcalidrawInitialDataState, ExcalidrawProps } from "@excalidraw/excalidraw/types";
// import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import { useStores } from "@/hooks/useStores";

// const components: TLUiComponents & { Grid: typeof Grid } = {
//     MenuPanel: null,
//     Grid,
//     Toolbar: Toolbar as TLUiComponents["Toolbar"],
// };

// type DrawProps = {
//     id: string;
//     callback: (editor: Editor) => void;
// };
// const overrides: TLUiOverrides = {
//     // @ts-expect-error
//     actions(editor, actions, helpers) {
//         const newActions = {
//             ...actions,
//             "toggle-grid": {
//                 ...actions["toggle-grid"],
//                 id: "toggle-grid",
//                 kbd: "Shift+G",
//             },
//         };

//         return newActions;
//     },
// };

// function Draw({ id, callback }: DrawProps) {
//     const store = useMemo(() => createTLStore(), []);
//     const { sketchesStore } = useStores();

//     const sketch = sketchesStore.getById(id);

//     useLayoutEffect(() => {
//         if (!sketch) {
//             return;
//         }

//         loadSnapshot(store, sketch.getSnapshot() as TLEditorSnapshot);

//         const cleanUp = store.listen(
//             throttle(() => {
//                 const snapshot = getSnapshot(store);
//                 sketch.setContent(snapshot);
//             }, 500),
//             {
//                 source: "user",
//                 scope: "document",
//             }
//         );

//         return () => {
//             cleanUp();
//         };
//     }, [sketch]);

//     if (!sketch) {
//         return null;
//     }

//     let data: ExcalidrawInitialDataState = {
//         elements: [],
//         appState: {
//             viewBackgroundColor: "white",
//         },
//         scrollToContent: true,
//     };

//     const onChange = (args: ExcalidrawProps["onChange"]) => {
//         console.log(args);
//     };

//     if (sketch.content && "elements" in sketch.content) {
//         data = sketch.content as ExcalidrawInitialDataState;
//     }

//     return (
//         <div className="relative h-full w-full">
//             <Excalidraw initialData={data} onChange={onChange} />
//         </div>
//     );
// }

// export { Draw };
