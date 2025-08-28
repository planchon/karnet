import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const taskTable = defineTable({
	title: v.string(),
	priority: v.number(),
	smallId: v.string(),
	is_deleted: v.boolean(),
	status: v.union(
		v.literal("todo"),
		v.literal("in_progress"),
		v.literal("done"),
	),
	deadline: v.optional(v.string()),
	deadlineLabel: v.optional(v.string()),
	completed_at_iso: v.optional(v.string()),
	completed_at_ts: v.optional(v.number()),
	created_at_iso: v.optional(v.string()),
	created_at_ts: v.optional(v.number()),
	updated_at_iso: v.optional(v.string()),
	updated_at_ts: v.optional(v.number()),
})
	.index("by_status", ["status"])
	.index("by_deadline", ["deadline"])
	.index("by_completed_at", ["completed_at_ts"])
	.index("by_created_at", ["created_at_ts"]);

const messageSource = v.object({
	title: v.string(),
	description: v.string(),
	type: v.union(v.literal("link")),
	link: v.optional(v.string()),
});

const chatMessage = v.object({
	role: v.union(v.literal("user"), v.literal("agent")),
	input: v.object({
		content: v.string(),
		image: v.optional(v.string()),
		audio: v.optional(v.string()),
		link: v.optional(v.string()),
		file: v.optional(v.string()),
	}),
	output: v.object({
		content: v.string(),
		image: v.optional(v.string()),
		sources: v.array(messageSource),
	}),
	created_at_iso: v.optional(v.string()),
	finished_at_iso: v.optional(v.string()),
	metadata: v.optional(v.string()),
});

const chatTable = defineTable({
	title: v.string(),
	description: v.string(),
	is_deleted: v.boolean(),
	created_at_iso: v.optional(v.string()),
	created_at_ts: v.optional(v.number()),
	updated_at_iso: v.optional(v.string()),
	updated_at_ts: v.optional(v.number()),
	// if we have forked the chat
	parent_id: v.optional(v.id("chats")),
	messages: v.array(chatMessage),
})
	.index("by_parent_id", ["parent_id"])
	.index("by_created_at", ["created_at_ts"])
	.index("by_updated_at", ["updated_at_ts"]);

export default defineSchema({
	tasks: taskTable,
	chats: chatTable,
});
