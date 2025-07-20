import z from "zod";
import { TaskModel } from "@/models/task.model";
import { AbstractStore } from "./abstract.store";

const ALL_TASKS_KEY = "p6n-all-tasks";

const taskMetadataSchema = z.object({
	id: z.string(),
});

const taskMetadataArraySchema = z.array(taskMetadataSchema);

export class TaskStore extends AbstractStore<TaskModel> {
	store_key = ALL_TASKS_KEY;
	store_name = "task";
	smallId = "TASK";

	loadInMemory(id: string | undefined): TaskModel {
		if (id === undefined) throw new Error("Id is undefined");
		return new TaskModel({ id });
	}

	createNewModel(id: string): TaskModel {
		const task = new TaskModel({ id });
		task.smallId = `TASK-${this.getLength() + 1}`;

		task.save();
		this.setModel(id, task);
		this.save();

		return task;
	}
}
