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
import { CopyIcon, SplitIcon } from "lucide-react";
import { type ComponentProps, type HTMLAttributes, useState } from "react";
import { useNavigate } from "react-router";
import { ProviderIcons, providerNames } from "@/ai/models";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModels } from "@/hooks/useModels";
import { cn } from "@/lib/utils";

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
    };

export const MessageContent = ({ children, className, variant, message, ...props }: MessageContentProps) => (
    <div className={cn("group flex w-full flex-col gap-2", className)}>
        <div className="flex w-full flex-col gap-2 group-[.is-user]:items-end group-[.is-user]:justify-end">
            <div className={cn(messageContentVariants({ variant, className }))} {...props}>
                {children}
            </div>
            <MessageActions message={message} />
        </div>
    </div>
);

export const MessageActions = ({ message }: { message: UIMessage }) => {
    const [visible, setVisible] = useState(false);
    const { activeGroupedByProvider } = useModels();
    const navigate = useNavigate();

    const retryMessage = (modelId: string) => {
        const messageText = message.parts.find((p) => p.type === "text")?.text;

        navigate("/chat", {
            state: {
                retryMessage: messageText,
                retryModel: modelId,
            },
        });
    };

    return (
        <div
            className={cn(
                "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-[.is-user]:flex-row-reverse",
                visible && "opacity-100"
            )}
        >
            <Button size="icon" variant="ghost">
                <CopyIcon />
            </Button>
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
                                        {providerNames[provider]}
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                        <DropdownMenuSubContent>
                                            {providerModels.map((model) => (
                                                <DropdownMenuItem key={model.id} onClick={() => retryMessage(model.id)}>
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
