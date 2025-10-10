import { R2 } from "@convex-dev/r2";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import { mutation, query } from "../_generated/server";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata } = r2.clientApi({
    checkUpload: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }
    },

    onUpload: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }
    },
});

export const deleteFile = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        return await r2.deleteObject(ctx, args.id);
    },
});

export const assignFileToUser = mutation({
    args: {
        id: v.string(),
        media_type: v.string(),
        filename: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const id = await ctx.db.insert("files", {
            subject: identity.subject,
            file_id: args.id,
            media_type: args.media_type,
            filename: args.filename,
        });

        const url = await r2.getUrl(args.id, {
            expiresIn: 60 * 60 * 24,
        });

        return {
            id,
            url,
        };
    },
});

export const getFile = query({
    args: {
        id: v.id("files"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const file = await ctx.db.get(args.id);
        if (!file || file.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "R2_0001",
                httpStatusCode: 404,
                message: "File not found",
            });
        }

        const url = await r2.getUrl(file.file_id, {
            expiresIn: 60 * 60 * 24,
        });

        return {
            ...file,
            url,
        };
    },
});
