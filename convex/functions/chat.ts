import { ConvexError, v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { internalMutation, internalQuery, type MutationCtx, mutation, query } from "../_generated/server";
import { chatMessage } from "../schema";

// get the identity of the user
// throw an error if the user is not authenticated
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

export const generateNewChat = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const existingChat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (existingChat) {
            return existingChat;
        }

        const chat = await ctx.db.insert("chats", {
            chat_id: args.id,
            subject: identity.subject,
            created_at_iso: new Date().toISOString(),
            created_at_ts: Date.now(),
            updated_at_iso: new Date().toISOString(),
            updated_at_ts: Date.now(),
            is_deleted: false,
            title: "New chat",
            messages: [],
            stream: {
                status: "starting",
                id: undefined,
            },
        });

        return chat;
    },
});

export const getChat = query({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        if (args.id === "skip") {
            return null;
        }

        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            return null;
        }

        for (const message of chat.messages) {
            const parts = JSON.parse(message.parts);
            for (const part of parts) {
                if (part.type === "file" && part._karnet_key) {
                    const url = await ctx.storage.getUrl(part._karnet_key as Id<"_storage">);
                    part.url = url;
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
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .order("desc")
            .take(limit);

        return chats;
    },
});

export const patchChatById = internalMutation({
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
        await ctx.db.patch(args.id, chat);
    },
});

export const updateChat = mutation({
    args: {
        id: v.string(),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.messages = args.messages;

        await ctx.db.patch(chat._id, chat);
    },
});

export const updateChatStream = mutation({
    args: {
        id: v.string(),
        stream: v.object({
            status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
            id: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.stream = args.stream;

        await ctx.db.patch(chat._id, chat);

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
        id: v.string(),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            return null;
        }

        chat.messages = args.messages;
        chat.stream.status = "inactive";
        chat.stream.id = undefined;

        await ctx.db.patch(chat._id, chat);

        return chat;
    },
});

// finish the stream and store the images in R2
export const finishChatStream = mutation({
    args: {
        id: v.string(),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

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

        await ctx.db.patch(chat._id, chat);

        return chat;
    },
});

export const updateChatTitle = mutation({
    args: {
        id: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.title = args.title;

        await ctx.db.patch(chat._id, chat);

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

export const deleteChat = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await getIdentity(ctx as MutationCtx);
        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id_and_subject", (q) => q.eq("chat_id", args.id).eq("subject", identity.subject))
            .first();

        if (!chat) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        await ctx.db.delete(chat._id);
    },
});
