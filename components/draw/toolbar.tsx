"use client";

import type { JSX } from "react";
import { DefaultToolbar, DefaultToolbarContent, type TLComponents, ToolbarItem } from "tldraw";

export const Toolbar = (props: TLComponents["Toolbar"]): JSX.Element => (
    <DefaultToolbar {...props}>
        <ToolbarItem tool="select" />
        <ToolbarItem tool="hand" />
        <ToolbarItem tool="text" />
        <ToolbarItem tool="draw" />
        <ToolbarItem tool="laser" />
        <ToolbarItem tool="rectangle" />
        <ToolbarItem tool="ellipse" />
        <ToolbarItem tool="arrow" />
        <ToolbarItem tool="note" />
        <DefaultToolbarContent />
    </DefaultToolbar>
);
