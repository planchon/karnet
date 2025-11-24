import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const activateModel = mutation({
    args: {
        model_id: v.string(),
        name: v.string(),
        provider: v.string(),
        features: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const id = await ctx.db.insert("models", {
            model_id: args.model_id,
            name: args.name,
            provider: args.provider,
            features: args.features,
            subject: identity.subject,
        });

        return { id };
    },
});

export const deactivateModel = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const model = await ctx.db
            .query("models")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!model) {
            throw new Error("Model not found");
        }

        await ctx.db.delete(model._id);

        return {};
    },
});

export const getModels = query({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const models = await ctx.db
            .query("models")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .collect();

        if (models.length === 0) {
            return [
                {
                    model_id: "google/gemini-2.5-flash-preview-09-2025",
                    name: "Gemini 2.5 Flash",
                    provider: "google",
                    features: ["text", "image"],
                },
                {
                    model_id: "google/gemini-2.5-flash-image",
                    name: "Gemini 2.5 Flash Image",
                    provider: "google",
                    features: ["image"],
                },
            ];
        }

        return models;
    },
});

export const setDefaultModel = mutation({
    args: {
        id: v.id("models"),
        modality: v.union(v.literal("text"), v.literal("image")),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const model = await ctx.db
            .query("models")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("default"), true))
            .filter((q) => q.eq(q.field("modality"), args.modality))
            .first();

        if (model) {
            await ctx.db.patch(model._id, {
                default: false,
                modality: args.modality,
            });
        }

        await ctx.db.patch(args.id, {
            default: true,
            modality: args.modality,
        });
    },
});
