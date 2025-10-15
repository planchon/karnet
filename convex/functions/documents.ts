import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getUserDocuments = query({
    args: {
        paginationOpts: paginationOptsValidator,
    },
    handler: async (ctx, { paginationOpts }) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "TASK_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const documents = await ctx.db
            .query("documents")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("is_deleted"), false))
            .order("desc")
            .paginate(paginationOpts);

        return documents;
    },
});

export const createEmptyDocument = mutation({
    args: {
        type: v.union(v.literal("paper"), v.literal("sketch"), v.literal("diagram")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const baseQuery = ctx.db.query("documents").withIndex("by_subject", (q) => q.eq("subject", identity.subject));

        let smallId = "";
        switch (args.type) {
            case "paper": {
                const totalDocuments = await baseQuery.filter((q) => q.eq(q.field("type"), "paper")).collect();
                smallId = `PPR-${totalDocuments.length + 1}`;
                break;
            }
            case "sketch": {
                const totalDocuments = await baseQuery.filter((q) => q.eq(q.field("type"), "sketch")).collect();
                smallId = `SKT-${totalDocuments.length + 1}`;
                break;
            }
            case "diagram": {
                const totalDocuments = await baseQuery.filter((q) => q.eq(q.field("type"), "diagram")).collect();
                smallId = `DGM-${totalDocuments.length + 1}`;
                break;
            }
            default:
                throw new ConvexError({
                    uniqueId: "DOCUMENT_0003",
                    httpStatusCode: 400,
                    message: "Invalid document type",
                });
        }

        const base = {
            type: args.type,
            subject: identity.subject,
            is_deleted: false,
            created_at_iso: new Date().toISOString(),
            created_at_ts: Date.now(),
            title: `New ${args.type}`,
            smallId,
            data: args.type === "sketch" ? "[]" : "",
        };

        const document = await ctx.db.insert("documents", base);

        return {
            _id: document,
            ...base,
        };
    },
});

export const getDocumentBySmallId = query({
    args: {
        smallId: v.string(),
        type: v.union(v.literal("paper"), v.literal("sketch"), v.literal("diagram")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0004",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const document = await ctx.db
            .query("documents")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("smallId"), args.smallId))
            .filter((q) => q.eq(q.field("type"), args.type))
            .first();

        if (!document || document.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0005",
                httpStatusCode: 404,
                message: "Document not found",
            });
        }

        return document;
    },
});

export const updateDocument = mutation({
    args: {
        id: v.id("documents"),
        data: v.optional(v.string()),
        title: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0006",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const document = await ctx.db.get(args.id);
        if (!document || document.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0007",
                httpStatusCode: 404,
                message: "Document not found",
            });
        }

        await ctx.db.patch(args.id, {
            data: args.data ?? document.data,
            title: args.title ?? document.title,
            updated_at_iso: new Date().toISOString(),
            updated_at_ts: Date.now(),
        });

        return document;
    },
});

export const deleteDocument = mutation({
    args: {
        id: v.id("documents"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0008",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const document = await ctx.db.get(args.id);
        if (!document || document.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "DOCUMENT_0009",
                httpStatusCode: 404,
                message: "Document not found",
            });
        }

        await ctx.db.patch(args.id, {
            is_deleted: true,
            updated_at_iso: new Date().toISOString(),
            updated_at_ts: Date.now(),
        });

        return document;
    },
});
