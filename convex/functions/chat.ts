import { ConvexError, v } from "convex/values";
import { internal } from "../_generated/api";
import { action, internalMutation, internalQuery, type MutationCtx, mutation, query } from "../_generated/server";
import { chatMessage } from "../schema";
import { r2 } from "./files";

const getIdentity = async (ctx: MutationCtx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new ConvexError({
            uniqueId: "CHAT_0002",
            httpStatusCode: 401,
            message: "User not authenticated",
        });
    }

    return identity;
};

export const getChat = query({
    args: {
        id: v.id("chats"),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_id", (q) => q.eq("_id", args.id))
            .filter((q) => q.eq(q.field("subject"), identity.subject))
            .first();

        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        for (const message of chat.messages) {
            const parts = JSON.parse(message.parts);
            for (const part of parts) {
                if (part.type === "file" && part._karnet_key) {
                    part.url = await r2.getUrl(part._karnet_key, { expiresIn: 60 * 60 * 24 });
                }
            }
            message.parts = JSON.stringify(parts);
        }

        return chat;
    },
});

export const getLastChats = query({
    args: {
        limit: v.number(),
    },
    handler: async (ctx, { limit }) => {
        const identity = await getIdentity(ctx as MutationCtx);
        // we dont want to get the "New chat..." in the chat
        const chats = await ctx.db
            .query("chats")
            .withIndex("by_is_new_and_subject", (q) => q.eq("is_new", false).eq("subject", identity.subject))
            .order("desc")
            .take(limit);

        return chats;
    },
});

export const updateChat = mutation({
    args: {
        id: v.id("chats"),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.messages = args.messages;
        chat.is_new = false;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const updateChatStream = mutation({
    args: {
        id: v.id("chats"),
        stream: v.object({
            status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
            id: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);
        if (!identity) {
            throw new ConvexError({
                uniqueId: "CHAT_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.stream = args.stream;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const getChatById = internalQuery({
    args: {
        id: v.id("chats"),
    },
    handler: async (ctx, args) =>
        await ctx.db
            .query("chats")
            .withIndex("by_id", (q) => q.eq("_id", args.id))
            .first(),
});

export const finishChatStreamMutation = internalMutation({
    args: {
        id: v.id("chats"),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const chat = await ctx.db.get(args.id);
        if (!chat) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.messages = args.messages;
        chat.stream.status = "inactive";
        chat.stream.id = undefined;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

function dataURItoBlob(dataURI: string) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    const byteString = atob(dataURI.split(",")[1]);

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    const bb = new Blob([ab]);
    return bb;
}

// finish the stream and store the images in R2
export const finishChatStream = action({
    args: {
        id: v.id("chats"),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "CHAT_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const messages = args.messages;

        for (const message of messages) {
            const parts = JSON.parse(message.parts);
            let imageInMessage = 1;
            for (const part of parts) {
                if (part.type === "file" && part.url.includes("data:image")) {
                    const blob = dataURItoBlob(part.url);
                    const key = `chat/${args.id.toString()}/${message.id}-${imageInMessage}.png`;
                    const result = await r2.store(ctx, blob, { key });
                    const signedUrl = await r2.getUrl(result, {
                        expiresIn: 60 * 60 * 24,
                    });
                    part.url = signedUrl;
                    part._karnet_key = key;
                    imageInMessage++;
                }
            }
            message.parts = JSON.stringify(parts);
        }

        await ctx.runMutation(internal.functions.chat.finishChatStreamMutation, {
            id: args.id,
            messages,
        });
    },
});

export const updateChatTitle = mutation({
    args: {
        id: v.id("chats"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.title = args.title;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const updateChatMetadata = mutation({
    args: {
        id: v.id("chats"),
        metadata: v.object({
            input_tokens: v.number(),
            output_tokens: v.number(),
        }),
        model: v.object({
            name: v.string(),
            id: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db.get(args.id);

        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        const messages = chat.messages;
        const lastMessage = messages.at(-1);

        if (!lastMessage) {
            throw new ConvexError({
                uniqueId: "CHAT_0003",
                httpStatusCode: 404,
                message: "Last message not found",
            });
        }

        const metadata = JSON.stringify({
            ...(lastMessage.metadata ? JSON.parse(lastMessage.metadata) : {}),
            ...args.metadata,
            model: args.model,
        });

        lastMessage.metadata = metadata;

        chat.messages = messages;

        await ctx.db.patch(args.id, chat);
    },
});

// this function is used to create an id
export const createEmptyChat = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await getIdentity(ctx as MutationCtx);

        // see if we have a new chat
        const newChat = await ctx.db
            .query("chats")
            .withIndex("by_is_new_and_subject", (q) => q.eq("is_new", true).eq("subject", identity.subject))
            .first();

        if (newChat) {
            return newChat;
        }

        const chat = {
            title: "New chat...",
            created_at_iso: new Date().toISOString(),
            is_new: true,
            created_at_ts: Date.now(),
            subject: identity.subject,
            is_deleted: false,
            messages: [],
            stream: {
                status: "starting" as const,
            },
        };

        const id = await ctx.db.insert("chats", chat);

        return {
            ...chat,
            _id: id,
        };
    },
});

export const deleteChat = mutation({
    args: {
        id: v.id("chats"),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);
        const chat = await ctx.db.get(args.id);

        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        await ctx.db.delete(args.id);
    },
});
