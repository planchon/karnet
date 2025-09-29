import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import type { Id } from "../_generated/dataModel";
import { mutation, query } from "../_generated/server";

export const getPaginatedTasks = query({
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

        const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("is_deleted"), false))
            .order("desc")
            .paginate(paginationOpts);

        return tasks;
    },
});

const status = v.union(v.literal("todo"), v.literal("in_progress"), v.literal("done"));

export const createTask = mutation({
    args: {
        title: v.string(),
        priority: v.number(),
        status: v.optional(status),
        tags: v.optional(v.array(v.string())),
        deadline: v.optional(v.number()),
        deadlineLabel: v.optional(v.string()),
        completed_at_iso: v.optional(v.string()),
        completed_at_ts: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const totalTasks = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .collect();
        const newId = totalTasks.length + 1;

        const taskModel = {
            title: args.title,
            // the smallId is optimicly generated in the UI, but can be replaced by the backend
            smallId: `TASK-${newId}`,
            type: "task" as const,
            priority: args.priority,
            status: args.status ?? "todo",
            deadline: args.deadline,
            deadlineLabel: args.deadlineLabel,
            tags: args.tags ?? [],
            created_at_iso: new Date().toISOString(),
            created_at_ts: Date.now(),
            is_deleted: false,
            subject: identity.subject,
        };

        const task = await ctx.db.insert("tasks", taskModel);

        // @ts-expect-error
        taskModel.id = task;

        return taskModel;
    },
});

export const updateTask = mutation({
    args: {
        id: v.string(),
        patch: v.object({
            title: v.optional(v.string()),
            priority: v.optional(v.number()),
            deadline: v.optional(v.number()),
            deadlineLabel: v.optional(v.string()),
            tags: v.optional(v.array(v.string())),
            status: v.optional(status),
            completed_at_iso: v.optional(v.string()),
            completed_at_ts: v.optional(v.number()),
        }),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const task = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = await ctx.db.patch(task._id as Id<"tasks">, {
            ...args.patch,
        });
        return updatedTask;
    },
});

export const toggleTask = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const task = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = await ctx.db.patch(task._id as Id<"tasks">, {
            completed_at_ts: task.completed_at_ts ? undefined : Date.now().valueOf(),
        });
        return updatedTask;
    },
});

export const deleteTask = mutation({
    args: {
        id: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("User not authenticated");
        }

        const task = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!task) {
            throw new Error("Task not found");
        }

        const updatedTask = await ctx.db.patch(task._id as Id<"tasks">, {
            is_deleted: true,
            completed_at_ts: Date.now().valueOf(),
            status: "done",
        });
        return updatedTask;
    },
});
