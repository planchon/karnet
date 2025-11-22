import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const chatMessage = v.object({
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    parts: v.string(),
    id: v.string(),
    metadata: v.optional(v.string()),
});

const chatTable = defineTable({
    chat_id: v.string(),
    subject: v.string(),
    is_deleted: v.boolean(),
    created_at_iso: v.string(),
    created_at_ts: v.number(),
    updated_at_iso: v.optional(v.string()),
    updated_at_ts: v.optional(v.number()),

    // if we have forked the chat
    title: v.string(),
    messages: v.array(chatMessage),

    // for the resumable stream option
    stream: v.object({
        status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
        id: v.optional(v.string()),
    }),
})
    .index("by_chat_id", ["chat_id"])
    .index("by_chat_id_and_subject", ["chat_id", "subject"])
    .index("by_subject", ["subject"]);

const model = {
    model_id: v.string(),
    name: v.string(),
    provider: v.string(),
    features: v.array(v.string()),
    default: v.optional(v.boolean()),
    modality: v.optional(v.union(v.literal("text"), v.literal("image"))),
};

const modelTable = defineTable({
    subject: v.string(),
    ...model,
}).index("by_subject", ["subject"]);

export default defineSchema({
    chats: chatTable,
    models: modelTable,
});
