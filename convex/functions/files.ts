import { R2 } from "@convex-dev/r2";
import { ConvexError, v } from "convex/values";
import { components } from "../_generated/api";
import type { Id } from "../_generated/dataModel";
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

export const generateImageUploadUrl = mutation({
    args: {},
    handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const getImageUrl = query({
    args: {
        id: v.id("_storage"),
    },
    handler: async (_ctx, args) => {
        const url = await _ctx.storage.getUrl(args.id);
        return { url };
    },
});
