import type { ChatStatus, ReasoningUIPart, SourceUrlUIPart, TextUIPart, UIMessage } from "ai";
import { memo } from "react";
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

const isEmptyMessage = (message: UIMessage | undefined) =>
    message === undefined ||
    message.parts.length === 0 ||
    (message.parts.length === 1 && message.parts[0].type === "step-start") ||
    message.parts.every((p) => p.type === "text" && p.text === "") ||
    message.parts.every((p) => p.type === "source-url" && p.url === "") ||
    message.parts.every((p) => p.type === "reasoning" && p.text === "");

export const RenderOneMessage = memo(({ message, status }: { message: UIMessage; status: ChatStatus }) => {
    const isEmpty = isEmptyMessage(message);

    if (isEmpty) {
        return null;
    }

    const reasoningParts = message.parts.filter((p) => p.type === "reasoning");
    const textParts = message.parts.filter((p) => p.type === "text");
    const sourceParts = message.parts.filter((p) => p.type === "source-url");

    return (
        <Message from={message.role} key={message.id}>
            <MessageContent variant="flat">
                <RenderReasoning messageId={message.id} offsetPartIndex={0} part={reasoningParts} status={status} />
                <RenderText messageId={message.id} offsetPartIndex={0} part={textParts} />
                <RenderSource messageId={message.id} offsetPartIndex={0} part={sourceParts} status={status} />
            </MessageContent>
        </Message>
    );
});

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

export const ConversationComp = ({ messages, status }: { messages: UIMessage[]; status: ChatStatus }) => {
    // the random index is the minute we are on
    const randomIndex = Math.floor(new Date().getMinutes() % allCoolLoadingPhrases.length);
    return (
        <Conversation className="relative h-full w-full" isGenerating={status === "streaming"}>
            <ConversationContent className="mx-auto w-8/12 pb-64">
                {messages.map((message) => (
                    <RenderOneMessage key={message.id} message={message} status={status} />
                ))}
                {(status === "submitted" || (status === "streaming" && isEmptyMessage(messages.at(-1)))) && (
                    <TextShimmer className="text-sm">{allCoolLoadingPhrases[randomIndex]}</TextShimmer>
                )}
            </ConversationContent>
            <ConversationScrollButton className="bottom-[180px]" />
        </Conversation>
    );
};
