"use client";

import type { TaskModel } from "@/models/task.model";
import { AbstractView } from "./abstract.view";

export class TaskView extends AbstractView<TaskModel> {
	get getAllItems(): TaskModel[] {
		return this.rootStore.taskStore.allModels;
	}

	orderBy(items: TaskModel[]): TaskModel[] {
		return items;
	}

	search(items: TaskModel[]): TaskModel[] {
		return items.filter((item) =>
			item.title.toLowerCase().includes(this.query.toLowerCase()),
		);
	}

	filterBy(items: TaskModel[]): TaskModel[] {
		return items;
	}

	displayColumns(): string[] {
		return ["id", "title", "completed", "createdAt", "targetDate"];
	}

	groupBy(items: TaskModel[]): Record<string, TaskModel[]> {
		return {
			all: items,
		};
	}
}
