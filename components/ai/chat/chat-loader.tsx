import { motion } from "framer-motion";
import React, { type JSX, useMemo } from "react";
import { cn } from "@/lib/utils";

export function ChatLoader() {
    return (
        <div className="flex items-center gap-1.5">
            <motion.div
                animate={{
                    y: [0, -4, 0],
                }}
                className="h-2 w-2 rounded-full bg-muted-foreground/60"
                transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0,
                }}
            />
            <motion.div
                animate={{
                    y: [0, -4, 0],
                }}
                className="h-2 w-2 rounded-full bg-muted-foreground/60"
                transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.2,
                }}
            />
            <motion.div
                animate={{
                    y: [0, -4, 0],
                }}
                className="h-2 w-2 rounded-full bg-muted-foreground/60"
                transition={{
                    duration: 0.6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.4,
                }}
            />
        </div>
    );
}

export type TextShimmerProps = {
    children: string;
    as?: React.ElementType;
    className?: string;
    duration?: number;
    spread?: number;
};

function TextShimmerComponent({ children, className, duration = 2, spread = 2 }: TextShimmerProps) {
    const dynamicSpread = useMemo(() => children.length * spread, [children, spread]);

    return (
        <motion.div
            animate={{ backgroundPosition: "0% center" }}
            className={cn(
                "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
                "text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]",
                "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]",
                "dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
                className
            )}
            initial={{ backgroundPosition: "100% center" }}
            style={
                {
                    "--spread": `${dynamicSpread}px`,
                    backgroundImage: "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
                } as React.CSSProperties
            }
            transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration,
                ease: "linear",
            }}
        >
            {children}
        </motion.div>
    );
}

export const TextShimmer = React.memo(TextShimmerComponent);
