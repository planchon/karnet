"use client";

import { Root } from "@/router/root";

export default function Page({ children }: { children: React.ReactNode }) {
    return <Root>{children}</Root>;
}

export const dynamic = "force-dynamic";
