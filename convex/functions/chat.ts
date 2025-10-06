import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { chatMessage } from "../schema";

export const getChat = query({
    args: {
        chat_id: v.string(),
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

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("chat_id"), args.chat_id))
            .first();

        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        return chat;
    },
});

export const getLastChats = query({
    args: {
        limit: v.number(),
    },
    handler: async (ctx, { limit }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "CHAT_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        // we dont want to get the "New chat..." in the chat
        const chats = await ctx.db
            .query("chats")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .order("desc")
            .take(limit);

        return chats;
    },
});

export const updateChat = mutation({
    args: {
        chat_id: v.string(),
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

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id", (q) => q.eq("chat_id", args.chat_id))
            .first();

        if (!chat || chat.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "CHAT_0001",
                httpStatusCode: 404,
                message: "Chat not found",
            });
        }

        chat.messages = args.messages;

        await ctx.db.patch(chat._id, chat);

        return chat;
    },
});

export const updateChatStream = mutation({
    args: {
        chat_id: v.string(),
        stream: v.object({
            status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
            id: v.optional(v.string()),
        }),
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

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id", (q) => q.eq("chat_id", args.chat_id))
            .first();
        if (!chat || chat.subject !== identity.subject) {
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

export const finishChatStream = mutation({
    args: {
        chat_id: v.string(),
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

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id", (q) => q.eq("chat_id", args.chat_id))
            .first();

        if (!chat || chat.subject !== identity.subject) {
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
        chat_id: v.string(),
        title: v.string(),
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

        const chat = await ctx.db
            .query("chats")
            .withIndex("by_chat_id", (q) => q.eq("chat_id", args.chat_id))
            .first();
        if (!chat || chat.subject !== identity.subject) {
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
