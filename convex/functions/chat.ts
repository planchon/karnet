import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { chatMessage } from "../schema";

export const getChat = query({
    args: {
        id: v.id("chats"),
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
            .filter((q) => q.eq(q.field("_id"), args.id))
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
            .filter((q) => q.not(q.eq(q.field("is_new"), true)))
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
        const identity = await ctx.auth.getUserIdentity();
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
        const identity = await ctx.auth.getUserIdentity();
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

export const finishChatStream = mutation({
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

        const chat = await ctx.db.get(args.id);
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

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const updateChatTitle = mutation({
    args: {
        id: v.id("chats"),
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
        const identity = await ctx.auth.getUserIdentity();
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
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "CHAT_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

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
