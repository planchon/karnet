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
