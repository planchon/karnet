import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getAllTasks = query({
	args: {},
	handler: async (ctx) => {
		const tasks = await ctx.db.query("tasks").order("desc").take(100);
		return tasks;
	},
});

const status = v.union(
	v.literal("todo"),
	v.literal("in_progress"),
	v.literal("done"),
);

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
		const totalTasks = await ctx.db.query("tasks").collect();
		const newId = totalTasks.length + 1;

		const taskModel = {
			title: args.title,
			// the smallId is optimicly generated in the UI, but can be replaced by the backend
			smallId: `TASK-${newId}`,
			priority: args.priority,
			status: args.status ?? "todo",
			deadline: args.deadline,
			deadlineLabel: args.deadlineLabel,
			created_at_iso: new Date().toISOString(),
			created_at_ts: Date.now(),
			is_deleted: false,
		};

		const task = await ctx.db.insert("tasks", taskModel);

		// @ts-ignore
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
	},
	handler: async (ctx, args) => {
		const task = await ctx.db.get(args.id);
		if (!task) {
			throw new Error("Task not found");
		}
		await ctx.db.patch(args.id, {
			title: args.title ?? task.title,
			priority: args.priority ?? task.priority,
			status: args.status ?? task.status,
			updated_at_ts: Date.now(),
			updated_at_iso: new Date().toISOString(),
		});
		return task;
	},
});
