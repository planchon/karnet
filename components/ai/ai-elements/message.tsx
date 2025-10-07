import type { useChat } from "@ai-sdk/react";
import { Button } from "@ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import type { UIMessage } from "ai";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion } from "framer-motion";
import _ from "lodash";
import {
    BrainIcon,
    CheckIcon,
    ClockIcon,
    CopyIcon,
    CpuIcon,
    RotateCcwIcon,
    SplitIcon,
    Zap,
    ZapIcon,
} from "lucide-react";
import { type ComponentProps, type HTMLAttributes, useState } from "react";
import { z } from "zod";
import { getProviderName, ProviderIcons, providerNames } from "@/ai/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useModels } from "@/hooks/useModels";
import { cn } from "@/lib/utils";
import type { Regenerate } from "@/types/regenerate";

export type MessageProps = HTMLAttributes<HTMLDivElement> & {
    from: UIMessage["role"];
};

export const Message = ({ className, from, ...props }: MessageProps) => (
    <div
        className={cn(
            "group flex w-full items-end justify-end gap-2 py-4",
            from === "user" ? "is-user" : "is-assistant flex-row-reverse justify-end",
            className
        )}
        {...props}
    />
);

const messageContentVariants = cva("is-user:dark flex flex-col gap-2 overflow-hidden rounded-lg text-sm", {
    variants: {
        variant: {
            contained: [
                "max-w-[80%] px-4 py-3",
                "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground",
                "group-[.is-assistant]:bg-secondary group-[.is-assistant]:text-foreground",
            ],
            flat: [
                "group-[.is-user]:w-fit group-[.is-user]:max-w-[80%] group-[.is-user]:border group-[.is-user]:bg-secondary group-[.is-user]:px-4 group-[.is-user]:py-3 group-[.is-user]:text-foreground",
                "group-[.is-assistant]:text-foreground",
            ],
        },
    },
    defaultVariants: {
        variant: "contained",
    },
});

export type MessageContentProps = HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof messageContentVariants> & {
        message: UIMessage;
        regenerate: Regenerate;
    };

export const MessageContent = ({
    children,
    className,
    variant,
    message,
    regenerate,
    ...props
}: MessageContentProps) => (
    <div className={cn("group flex w-full flex-col gap-2", className)}>
        <div className="flex w-full flex-col gap-2 group-[.is-user]:items-end group-[.is-user]:justify-end">
            <div className={cn(messageContentVariants({ variant, className }))} {...props}>
                {children}
            </div>
            <MessageActions message={message} regenerate={regenerate} />
        </div>
    </div>
);

const MetadataSchema = z.object({
    model: z.object({
        name: z.string(),
        id: z.string(),
        provider: z.string(),
    }),
    usage: z.object({
        inputTokens: z.number(),
        outputTokens: z.number(),
        reasoningTokens: z.number().nullish(),
        cachedInputTokens: z.number().nullish(),
        totalTokens: z.number(),
    }),
    time: z.number(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

export const MessageActions = ({ message, regenerate }: { message: UIMessage; regenerate: Regenerate }) => {
    const [visible, setVisible] = useState(false);
    const [isCopied, handleCopy] = useCopyToClipboard();
    const { activeGroupedByProvider } = useModels();

    const text = message.parts.find((part) => part.type === "text")?.text;

    let metadata: Metadata | null = null;
    if (message.role === "assistant") {
        const metadataParsed = MetadataSchema.safeParse(message.metadata);
        if (metadataParsed.success) {
            metadata = metadataParsed.data;
        }
    }

    return (
        <div
            className={cn(
                "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.is-user]:flex-row-reverse",
                visible && "opacity-100"
            )}
        >
            <Button onClick={() => handleCopy(text || "wtf")} size="icon" variant="ghost">
                <AnimatePresence initial={false} mode="wait">
                    {isCopied ? (
                        <motion.div
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            initial={{ opacity: 0, scale: 0 }}
                            key="copied"
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                        >
                            <CheckIcon />
                        </motion.div>
                    ) : (
                        <motion.div
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            initial={{ opacity: 0, scale: 0 }}
                            key="copy"
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                        >
                            <CopyIcon />
                        </motion.div>
                    )}
                </AnimatePresence>
            </Button>
            {message.role === "assistant" && (
                <div className="flex items-center gap-1">
                    <Button onClick={() => regenerate({ messageId: message.id })} size="icon" variant="ghost">
                        <RotateCcwIcon />
                    </Button>
                    {metadata && (
                        <div className="flex gap-2">
                            <div className="flex items-center gap-1 font-semibold text-muted-foreground text-xs">
                                {metadata.model.name}
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <CpuIcon className="size-3" />
                                {metadata.usage.outputTokens} tokens
                            </div>
                            {_.isNumber(metadata.usage.reasoningTokens) && metadata.usage.reasoningTokens > 0 && (
                                <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                    <BrainIcon className="size-3" />
                                    {metadata.usage.reasoningTokens} tokens
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <ClockIcon className="size-3" />
                                {(metadata.time / 1000).toFixed(2)}s
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground text-xs">
                                <ZapIcon className="size-3" />
                                {(metadata.usage.outputTokens / (metadata.time / 1000)).toFixed(2)} tok/s
                            </div>
                        </div>
                    )}
                </div>
            )}
            {message.role === "user" && (
                <DropdownMenu onOpenChange={setVisible} open={visible}>
                    <DropdownMenuTrigger asChild>
                        <Button
                            className="rotate-180 focus-visible:outline-none focus-visible:ring-0"
                            size="icon"
                            variant="ghost"
                        >
                            <SplitIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-40">
                        {Object.entries(activeGroupedByProvider).map(([provider, providerModels]) => (
                            <DropdownMenuGroup key={provider}>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex h-9 w-full items-center justify-between gap-2">
                                        <ProviderIcons className="size-4 w-6" provider={provider} />
                                        {getProviderName(provider)}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {providerModels.map((model) => (
                                                <DropdownMenuItem
                                                    key={model.id}
                                                    onClick={() => regenerate({ messageId: message.id }, model)}
                                                >
                                                    <ProviderIcons provider={model.provider} />
                                                    {model.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                            </DropdownMenuGroup>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export type MessageAvatarProps = ComponentProps<typeof Avatar> & {
    src: string;
    name?: string;
};

export const MessageAvatar = ({ src, name, className, ...props }: MessageAvatarProps) => (
    <Avatar className={cn("size-8 ring-1 ring-border", className)} {...props}>
        <AvatarImage alt="" className="mt-0 mb-0" src={src} />
        <AvatarFallback>{name?.slice(0, 2) || "ME"}</AvatarFallback>
    </Avatar>
);
