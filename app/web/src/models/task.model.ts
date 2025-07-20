import { makeObservable, observable } from "mobx";
import { AbstractModel } from "@/models/abstract.model";

export class TaskModel extends AbstractModel {
	type = "task" as const;

	completed = false;
	completedAt: Date | null = null;

	targetDate: Date | null = null;

	title: string = "";

	constructor(props: Partial<TaskModel> & { id: string }) {
		super(props);

		makeObservable(this, {
			title: observable,
			completed: observable,
			completedAt: observable,
			targetDate: observable,
		});
	}

	getSmallId(id: number): string {
		return `TASK-${id}`;
	}

	toJSON(): unknown {
		return {
			id: this.id,
			name: this.name,
			completed: this.completed,
		};
	}

	_id(): string {
		return `p6n-task-metadata-${this.id}`;
	}

	check() {
		this.completed = true;
		this.completedAt = new Date();
	}
}
