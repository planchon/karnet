import * as Sentry from "@sentry/nextjs";
import { UI_MESSAGE_STREAM_HEADERS } from "ai";
import { fetchQuery } from "convex/nextjs";
import { after } from "next/server";
import { createResumableStreamContext } from "resumable-stream";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { getSession } from "@/lib/session";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    return await Sentry.startSpan(
        {
            name: "GET /api/chat/[id]/stream",
            op: "http.server",
        },
        async (span) => {
            const { id } = await params;

            span.setAttributes({
                chatId: id,
            });

            const tokenRes = await getSession();

            if (!tokenRes) {
                span.setStatus({ code: 1, message: "Unauthorized" });
                return new Response("Unauthorized", { status: 401 });
            }

            const chat = await Sentry.startSpan(
                {
                    name: "fetchQuery getChat",
                    op: "db.query",
                },
                async (querySpan) => {
                    querySpan.setAttributes({
                        function: "api.functions.chat.getChat",
                        chatId: id,
                    });

                    return await fetchQuery(
                        api.functions.chat.getChat,
                        {
                            id: id as Id<"chats">,
                        },
                        {
                            token: tokenRes,
                        }
                    );
                }
            );

            if (!chat) {
                span.setStatus({ code: 1, message: "Chat not found" });
                return new Response("Chat not found", { status: 404 });
            }

            span.setAttributes({
                streamStatus: chat.stream.status,
                streamId: chat.stream.id,
            });

            if (chat.stream.status !== "active" || !chat.stream.id) {
                // no content response when there is no active stream
                span.setStatus({ code: 0, message: "No active stream" });
                return new Response(null, { status: 204 });
            }

            const streamContext = createResumableStreamContext({
                waitUntil: after,
            });

            span.setStatus({ code: 0, message: "Stream resumed successfully" });
            return new Response(await streamContext.resumeExistingStream(chat.stream.id), {
                headers: UI_MESSAGE_STREAM_HEADERS,
            });
        }
    );
}
