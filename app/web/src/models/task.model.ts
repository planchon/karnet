import { action, makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "@/models/abstract.model";

export type TaskStatus = "todo" | "in_progress" | "done";

export class TaskModel extends AbstractModel {
  type = "task" as const;

  completed = false;
  completedAt: Date | null = null;

  targetDate: Date | null = null;

  title = "";
  priority: number | null = null;

  deadlineLabel: string | null = null;
  deadlineDate: Date | null = null;

  status: TaskStatus = "todo";

  constructor(props: Partial<TaskModel> & { id: string }) {
    super(props);

    makeObservable(this, {
      title: observable,
      completed: observable,
      completedAt: observable,
      targetDate: observable,
      priority: observable,
      deadlineLabel: observable,
      deadlineDate: observable,
      setTitle: action,
      setDeadline: action,
      setPriority: action,
      setCompleted: action,
      status: observable,
      setStatus: action
    });

    this.load();

    reaction(
      () => this.toJSON(),
      () => {
        this.save();
      },
      {
        delay: 1000
      }
    );
  }

  getSmallId(id: number): string {
    return `TASK-${id}`;
  }

  toJSON(): unknown {
    return {
      id: this.id,
      name: this.name,
      deadlineLabel: this.deadlineLabel,
      deadlineDate: this.deadlineDate,
      priority: this.priority,
      title: this.title,
      completed: this.completed
    };
  }

  _id(): string {
    return `p6n-task-metadata-${this.id}`;
  }

  setCompleted() {
    if (this.completed) {
      this.completed = false;
      this.completedAt = null;
      return;
    }

    this.completed = true;
    this.completedAt = new Date();
  }

  setStatus(status: "todo" | "in_progress" | "done") {
    this.status = status;
  }

  setTitle(title: string | undefined) {
    if (!title) {
      this.title = "";
      return;
    }

    let tmpTitle = title;

    if (this.deadlineLabel) {
      tmpTitle = tmpTitle.replaceAll(` ${this.deadlineLabel}`, "");
    }

    if (this.priority) {
      tmpTitle = tmpTitle.replaceAll(` p${this.priority}`, "");
    }

    this.title = tmpTitle.trim();
  }

  setDeadline(deadline: string | undefined) {
    if (!deadline) {
      this.deadlineLabel = null;
      return;
    }

    this.deadlineLabel = deadline;
  }

  setPriority(priority: number | undefined) {
    if (!priority) {
      this.priority = null;
      return;
    }

    this.priority = priority;
  }
}
