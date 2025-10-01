import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const baseViewItem = {
  subject: v.string(),
  is_deleted: v.boolean(),
  created_at_iso: v.string(),
  created_at_ts: v.number(),
  updated_at_iso: v.optional(v.string()),
  updated_at_ts: v.optional(v.number()),
};

const taskTable = defineTable({
  ...baseViewItem,
  title: v.string(),
  type: v.literal("task"),
  smallId: v.string(),
  priority: v.number(),
  tags: v.array(v.string()),
  status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done")),
  deadline: v.optional(v.number()),
  deadlineLabel: v.optional(v.string()),
  completed_at_iso: v.optional(v.string()),
  completed_at_ts: v.optional(v.number()),
})
  .index("by_status", ["status"])
  .index("by_deadline", ["deadline"])
  .index("by_tags", ["tags"])
  .index("by_completed_at", ["completed_at_ts"])
  .index("by_created_at", ["created_at_ts"])
  .index("by_subject", ["subject"]);

export const chatMessage = v.object({
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
  parts: v.string(),
  id: v.string(),
  metadata: v.optional(v.string()),
});

const chatTable = defineTable({
  ...baseViewItem,
  // if we have forked the chat
  title: v.string(),
  smallId: v.optional(v.string()),
  messages: v.array(chatMessage),
  parent_id: v.optional(v.id("chats")),
  // for the resumable stream option
  stream: v.object({
    status: v.union(v.literal("active"), v.literal("inactive"), v.literal("error"), v.literal("starting")),
    id: v.optional(v.string()),
  }),
})
  .index("by_parent_id", ["parent_id"])
  .index("by_created_at", ["created_at_ts"])
  .index("by_updated_at", ["updated_at_ts"])
  .index("by_subject", ["subject"]);

const outlookCalendarConfig = defineTable({
  subject: v.string(),
  connection_status: v.union(
    // the user has not setup the calendar
    v.literal("connecting"),
    // the calendar is connected and data is being synced
    v.literal("connected"),
    // the calendar is disconnected
    v.literal("disconnected"),
    v.literal("error")
  ),
  sync_status: v.union(v.literal("not_setup"), v.literal("queued"), v.literal("running"), v.literal("completed")),
  last_sync_at: v.optional(v.number()),
  calendar_user_id: v.optional(v.string()),
  access_token: v.optional(v.string()),
  refresh_token: v.optional(v.string()),
  expires_at: v.optional(v.number()),
}).index("by_subject", ["subject"]);

const calendarTable = defineTable({
  config_id: v.id("outlook_calendar_config"),
});

export default defineSchema({
  tasks: taskTable,
  chats: chatTable,
  outlook_calendar_config: outlookCalendarConfig,
  calendars: calendarTable,
});
