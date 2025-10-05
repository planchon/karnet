"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type AnimatedTextAccordionProps = {
    text: string;
    previewLength?: number;
    className?: string;
};

export function AnimatedTextAccordion({ text, previewLength = 100, className = "" }: AnimatedTextAccordionProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const collapsedRef = useRef<HTMLDivElement>(null);
    const expandedRef = useRef<HTMLDivElement>(null);
    const [collapsedHeight, setCollapsedHeight] = useState(0);
    const [expandedHeight, setExpandedHeight] = useState(0);

    useEffect(() => {
        const measureHeights = () => {
            if (collapsedRef.current) {
                setCollapsedHeight(collapsedRef.current.scrollHeight);
            }
            if (expandedRef.current) {
                setExpandedHeight(expandedRef.current.scrollHeight);
            }
        };

        measureHeights();
        // Remeasure after a brief delay to catch any layout shifts
        const timeout = setTimeout(measureHeights, 200);
        return () => clearTimeout(timeout);
    }, [text]);

    const previewText = text.slice(0, previewLength);
    const showButton = text.length > previewLength;

    return (
        <div className={className}>
            <motion.div
                animate={{
                    height: isExpanded ? expandedHeight : collapsedHeight,
                }}
                className="relative overflow-hidden"
                initial={false}
                transition={{
                    duration: 0.5,
                }}
            >
                <div className="pointer-events-none invisible absolute" style={{ width: "100%" }}>
                    <div className="p-0" ref={collapsedRef}>
                        <p className="text-foreground leading-relaxed">
                            {previewText}
                            {showButton && <span className="text-muted-foreground">...</span>}
                        </p>
                    </div>
                </div>
                <div className="pointer-events-none invisible absolute" style={{ width: "100%" }}>
                    <div className="p-0" ref={expandedRef}>
                        <p className="text-foreground leading-relaxed">{text}</p>
                    </div>
                </div>

                <div className="relative">
                    <p className="text-foreground leading-relaxed">{text}</p>

                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                animate={{ opacity: 1 }}
                                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-card/80 to-card"
                                exit={{ opacity: 0 }}
                                initial={{ opacity: 0 }}
                                style={{ top: `${collapsedHeight - 40}px` }}
                                transition={{
                                    duration: 0.3,
                                }}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {showButton && (
                <Button className="mt-4 gap-2" onClick={() => setIsExpanded(!isExpanded)} size="sm" variant="ghost">
                    {isExpanded ? "Show less" : "Show more"}
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{
                            duration: 0.5,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.div>
                </Button>
            )}
        </div>
    );
}
