"use client";

import { Root } from "@/router/root";

export default function Page() {
    if (typeof window === "undefined") {
        return null;
    }

    return <Root />;
}

export const dynamic = "force-dynamic";
