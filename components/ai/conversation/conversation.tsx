import type {
    ChatStatus,
    ReasoningUIPart,
    SourceUrlUIPart,
    TextUIPart,
    UIDataTypes,
    UIMessage,
    UIMessagePart,
    UITools,
} from "ai";
import { Download } from "lucide-react";
import { memo } from "react";
import { _ImageExtensions, FilePreview } from "@/components/ui/file";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { cn } from "@/lib/utils";
import type { Regenerate } from "@/types/regenerate";
import { Conversation, ConversationContent, ConversationScrollButton } from "../ai-elements/conversation";
import { Message, MessageContent } from "../ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../ai-elements/reasoning";
import { Response } from "../ai-elements/response";
import { Source, Sources, SourcesContent, SourcesTrigger } from "../ai-elements/sources";
import { TextShimmer } from "../chat/chat-loader";

const RenderReasoning = memo(
    ({
        part,
        messageId,
        offsetPartIndex,
        status,
    }: {
        part: ReasoningUIPart[];
        messageId: string;
        offsetPartIndex: number;
        status: ChatStatus;
    }) => {
        if (part.length === 0) {
            return null;
        }

        return (
            <Reasoning isStreaming={status === "streaming"} key={`${messageId}-${offsetPartIndex}`}>
                <ReasoningTrigger />
                {part.map((p, i) => (
                    <ReasoningContent key={`${messageId}-${offsetPartIndex + i}`}>{p.text}</ReasoningContent>
                ))}
            </Reasoning>
        );
    }
);

const RenderText = ({
    part,
    messageId,
    offsetPartIndex,
}: {
    part: TextUIPart[];
    messageId: string;
    offsetPartIndex: number;
}) => part.map((p, i) => <Response key={`${messageId}-${offsetPartIndex + i}`}>{p.text}</Response>);

const RenderSource = memo(
    ({
        part,
        messageId,
        offsetPartIndex,
        status,
    }: {
        part: SourceUrlUIPart[];
        messageId: string;
        offsetPartIndex: number;
        status: ChatStatus;
    }) => {
        if (part.length === 0 || status === "streaming") {
            return null;
        }

        return (
            <Sources key={`${messageId}-${offsetPartIndex}`}>
                <SourcesTrigger count={part.length} />
                <SourcesContent>
                    {part.map((p, i) => (
                        <Source href={p.url} key={`${messageId}-${offsetPartIndex + i}`} title={p.title || "Source"} />
                    ))}
                </SourcesContent>
            </Sources>
        );
    }
);

const RenderFile = ({
    part,
    messageId,
    offsetPartIndex,
}: {
    part: UIMessagePart<UIDataTypes, UITools>[];
    messageId: string;
    offsetPartIndex: number;
}) => {
    if (part.length === 0 || part.every((p) => p.type !== "file")) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {part.map((p, i) => (
                <FilePreview filePart={p} key={`${messageId}-${offsetPartIndex + i}`} />
            ))}
        </div>
    );
};

const RenderImage = ({
    part,
    message,
    offsetPartIndex,
}: {
    part: UIMessagePart<UIDataTypes, UITools>[];
    message: UIMessage;
    offsetPartIndex: number;
}) => {
    const messageId = message.id;
    const isUser = message.role === "user";

    return (
        <div className="flex flex-wrap gap-2">
            {part
                .filter((p) => p.type === "file")
                .map((p, i) => (
                    <div className="group relative pb-2" key={`${messageId}-${offsetPartIndex + i}`}>
                        {!isUser && (
                            <button
                                className="absolute top-2 right-2 z-10 cursor-pointer rounded-sm border bg-white/80 p-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                                onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = p.url;
                                    link.download = `image-${messageId}-${offsetPartIndex + i}.png`;
                                    link.click();
                                }}
                                type="button"
                            >
                                <Download className="size-4" />
                            </button>
                        )}
                        <ImageZoom
                            backdropClassName={cn('[&_[data-rmiz-modal-overlay="visible"]]:bg-black/10')}
                            key={`${messageId}-${offsetPartIndex + i}`}
                            zoomMargin={100}
                        >
                            <picture className="relative" key={`${messageId}-${offsetPartIndex + i}`}>
                                <img
                                    alt="generated ai"
                                    className={cn(
                                        "rounded-md border bg-muted object-cover",
                                        isUser && "size-12",
                                        !isUser && "size-92 shadow-md"
                                    )}
                                    height={isUser ? 20 : 400}
                                    src={p.url}
                                    width={isUser ? 20 : 400}
                                />
                            </picture>
                        </ImageZoom>
                    </div>
                ))}
        </div>
    );
};

const isEmptyMessage = (message: UIMessage | undefined) =>
    message === undefined ||
    message.parts.length === 0 ||
    (message.parts.length === 1 && message.parts[0].type === "step-start") ||
    message.parts.every((p) => p.type === "text" && p.text === "") ||
    message.parts.every((p) => p.type === "source-url" && p.url === "") ||
    message.parts.every((p) => p.type === "reasoning" && p.text === "");

export const RenderOneMessage = ({
    message,
    status,
    regenerate,
}: {
    message: UIMessage;
    status: ChatStatus;
    regenerate: Regenerate;
}) => {
    const isEmpty = isEmptyMessage(message);

    if (isEmpty) {
        return null;
    }

    const reasoningParts = message.parts.filter((p) => p.type === "reasoning");
    const textParts = message.parts.filter((p) => p.type === "text");
    const sourceParts = message.parts.filter((p) => p.type === "source-url");
    const fileParts = message.parts.filter(
        (p) => p.type === "file" && !Object.keys(_ImageExtensions).includes(p.mediaType)
    );
    const imageParts = message.parts.filter(
        (p) => p.type === "file" && Object.keys(_ImageExtensions).includes(p.mediaType)
    );

    return (
        <Message from={message.role} key={message.id}>
            <MessageContent message={message} regenerate={regenerate} variant="flat">
                <RenderReasoning messageId={message.id} offsetPartIndex={0} part={reasoningParts} status={status} />
                <RenderText messageId={message.id} offsetPartIndex={0} part={textParts} />
                <RenderSource messageId={message.id} offsetPartIndex={0} part={sourceParts} status={status} />
                <RenderFile messageId={message.id} offsetPartIndex={0} part={fileParts} />
                <RenderImage message={message} offsetPartIndex={0} part={imageParts} />
            </MessageContent>
        </Message>
    );
};

const allCoolLoadingPhrases = [
    "Asking the magician...",
    "Consulting the oracle (not the cloud)...",
    "Calling Sam Altman...",
    "Not asking Luc Julia...",
    "Am I becoming human?",
    "Such a bad question...",
    "Dont you know that?",
    "All of that water wasted",
    "Googling for you...",
];

export const ConversationComp = ({
    messages,
    status,
    regenerate,
}: {
    messages: UIMessage[];
    status: ChatStatus;
    regenerate: Regenerate;
}) => {
    // the random index is the minute we are on
    const randomIndex = Math.floor(new Date().getMinutes() % allCoolLoadingPhrases.length);
    return (
        <Conversation className="relative h-full w-full" isGenerating={status === "streaming"}>
            <ConversationContent className="mx-auto w-8/12 pb-64">
                {messages.map((message) => (
                    <RenderOneMessage key={message.id} message={message} regenerate={regenerate} status={status} />
                ))}
                {(status === "submitted" || (status === "streaming" && isEmptyMessage(messages.at(-1)))) && (
                    <TextShimmer className="text-sm">{allCoolLoadingPhrases[randomIndex]}</TextShimmer>
                )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-[180px]" />
        </Conversation>
    );
};
