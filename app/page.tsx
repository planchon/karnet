"use client";

import { useEffect, useState } from "react";
import { Root } from "@/router/root";

export default function Page() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    if (loading) {
        return null;
    }

    return <Root />;
}

export const dynamic = "force-dynamic";
