import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const chatMessage = v.object({
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    parts: v.string(),
    id: v.string(),
    metadata: v.optional(v.string()),
});

const chatTable = defineTable({
    subject: v.string(),
    is_deleted: v.boolean(),
    created_at_iso: v.string(),
    created_at_ts: v.number(),
    updated_at_iso: v.optional(v.string()),
    updated_at_ts: v.optional(v.number()),

    // if we have forked the chat
    title: v.string(),
    smallId: v.optional(v.string()),
    messages: v.array(chatMessage),
    parent_id: v.optional(v.id("chats")),
    is_new: v.optional(v.boolean()),

    // for the resumable stream option
    stream: v.object({
        status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
        id: v.optional(v.string()),
    }),
})
    .index("by_parent_id", ["parent_id"])
    .index("by_created_at", ["created_at_ts"])
    .index("by_subject", ["subject"])
    .index("by_is_new_and_subject", ["is_new", "subject"]);

const modelTable = defineTable({
    subject: v.string(),
    model_id: v.string(),
    name: v.string(),
    provider: v.string(),
    features: v.array(v.string()),
    default: v.optional(v.boolean()),
    modality: v.optional(v.union(v.literal("text"), v.literal("image"))),
}).index("by_subject", ["subject"]);

const fileTable = defineTable({
    subject: v.string(),
    file_id: v.string(),
    media_type: v.string(),
    filename: v.string(),
}).index("by_subject", ["subject"]);

export default defineSchema({
    chats: chatTable,
    models: modelTable,
    files: fileTable,
});
