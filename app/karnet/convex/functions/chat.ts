import { generateId } from 'ai';
import { paginationOptsValidator } from 'convex/server';
import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';
import { chatMessage } from '../schema';

export const getChat = query({
    args: {
        id: v.id('chats'),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new Error('Chat not found');
        }

        return await ctx.db.get(args.id);
    },
});

export const getLastChats = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chats = await ctx.db
            .query('chats')
            .filter((q) => q.eq(q.field('subject'), identity.subject))
            .order('desc')
            .paginate(paginationOpts);

        return chats;
    },
});

// this function is used to create an id
export const createEmptyChat = mutation({
    args: {
        model: v.object({
            id: v.string(),
            name: v.string(),
            provider: v.string(),
        }),
        userInputMessage: v.string(),
        streamId: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chat = {
            title: `Untitled chat ${args.userInputMessage.slice(0, 20)}...`,
            smallId: `CHAT-${generateId()}`,
            created_at_iso: new Date().toISOString(),
            created_at_ts: Date.now(),
            subject: identity.subject,
            is_deleted: false,
            messages: [
                {
                    role: 'user' as const,
                    parts: JSON.stringify([
                        {
                            type: 'text' as const,
                            text: args.userInputMessage,
                        },
                    ]),
                    id: '',
                },
            ],
            stream: {
                status: 'starting' as const,
            },
        };

        const id = await ctx.db.insert('chats', chat);

        return {
            ...chat,
            _id: id,
        };
    },
});

export const updateChatStream = mutation({
    args: {
        id: v.id('chats'),
        stream: v.object({
            status: v.union(v.literal('active'), v.literal('inactive'), v.literal('error'), v.literal('starting')),
            id: v.optional(v.string()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new Error('Chat not found');
        }

        chat.stream = args.stream;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const finishChatStream = mutation({
    args: {
        id: v.id('chats'),
        messages: v.array(chatMessage),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new Error('Chat not found');
        }

        chat.messages = args.messages;
        chat.stream.status = 'inactive';
        chat.stream.id = undefined;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});

export const updateChatTitle = mutation({
    args: {
        id: v.id('chats'),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error('User not authenticated');
        }

        const chat = await ctx.db.get(args.id);
        if (!chat || chat.subject !== identity.subject) {
            throw new Error('Chat not found');
        }

        chat.title = args.title;

        await ctx.db.patch(args.id, chat);

        return chat;
    },
});
