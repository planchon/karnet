import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
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
        deadline: v.optional(v.string()),
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
        id: v.id("tasks"),
        title: v.optional(v.string()),
        priority: v.optional(v.number()),
        status: v.optional(status),
        deadlineLabel: v.optional(v.string()),
        completed_at_iso: v.optional(v.string()),
        completed_at_ts: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "TASK_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const task = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!task || task.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "TASK_0001",
                httpStatusCode: 404,
                message: "Task not found",
            });
        }

        await ctx.db.patch(args.id, {
            title: args.title ?? task.title,
            priority: args.priority ?? task.priority,
            status: args.status ?? task.status,
            updated_at_ts: Date.now(),
            updated_at_iso: new Date().toISOString(),
            deadlineLabel: args.deadlineLabel ?? task.deadlineLabel,
            completed_at_iso: args.completed_at_iso ?? task.completed_at_iso,
            completed_at_ts: args.completed_at_ts ?? task.completed_at_ts,
        });
        return task;
    },
});

export const toggleTask = mutation({
    args: {
        id: v.id("tasks"),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError({
                uniqueId: "TASK_0002",
                httpStatusCode: 401,
                message: "User not authenticated",
            });
        }

        const task = await ctx.db
            .query("tasks")
            .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
            .filter((q) => q.eq(q.field("_id"), args.id))
            .first();

        if (!task || task.subject !== identity.subject) {
            throw new ConvexError({
                uniqueId: "TASK_0001",
                httpStatusCode: 404,
                message: "Task not found",
            });
        }
        if (task.completed_at_ts) {
            await ctx.db.patch(args.id, {
                completed_at_iso: undefined,
                completed_at_ts: undefined,
            });
        } else {
            await ctx.db.patch(args.id, {
                completed_at_iso: new Date().toISOString(),
                completed_at_ts: Date.now(),
            });
        }
    },
});
