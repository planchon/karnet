import { UI_MESSAGE_STREAM_HEADERS } from "ai";
import { fetchQuery } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getSession } from "@/lib/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    console.log("[Stream] getting chat", id);

    const tokenRes = await getSession();

    if (!tokenRes) {
        return new Response("Unauthorized", { status: 401 });
    }

    const chat = await fetchQuery(
        api.functions.chat.getChat,
        {
            id: id as Id<"chats">,
        },
        {
            token: tokenRes,
        }
    );

    if (!chat) {
        return new Response("Chat not found", { status: 404 });
    }

    if (chat.stream.status !== "active" || !chat.stream.id) {
        console.log("[Stream] no active stream", {
            status: chat.stream.status,
            streamId: chat.stream.id,
            chatId: chat._id,
        });
        // no content response when there is no active stream
        return new Response(null, { status: 204 });
    }

    console.log("[Stream] resuming stream", {
        id: chat.stream.id,
    });

    const streamContext = createResumableStreamContext({
        waitUntil: after,
    });

    return new Response(await streamContext.resumeExistingStream(chat.stream.id), {
        headers: UI_MESSAGE_STREAM_HEADERS,
    });
}
