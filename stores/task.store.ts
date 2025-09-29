"use client";

import type { Dayjs } from "dayjs";
import { makeAutoObservable } from "mobx";

export class TaskStore {
    deadlineMatch: string | undefined = undefined;
    deadline: Dayjs | undefined = undefined;

    priorityMatch: string | undefined = undefined;
    priority: number | undefined = undefined;

    matchTags: string[] = [];
    tags = "";

    title: string | undefined = undefined;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    reset() {
        this.deadlineMatch = undefined;
        this.deadline = undefined;
        this.priorityMatch = undefined;
        this.priority = undefined;
        this.matchTags = [];
        this.tags = "";
        this.title = undefined;
    }

    setTitle(title: string) {
        this.title = title;
    }

    sanitizeTitle() {
        if (!this.title) {
            return;
        }

        let tmpTitle = this.title;
        if (this.deadlineMatch) {
            tmpTitle = tmpTitle.replaceAll(` ${this.deadlineMatch}`, "");
        }
        if (this.priorityMatch) {
            tmpTitle = tmpTitle.replaceAll(` ${this.priorityMatch}`, "");
        }

        for (const tag of this.matchTags) {
            tmpTitle = tmpTitle.replaceAll(` #${tag}`, "");
        }

        return tmpTitle;
    }

    setDeadlineMatch(match: string) {
        this.deadlineMatch = match;
    }

    setPriorityMatch(match: string) {
        this.priorityMatch = match;
    }

    setMatchTags(tags: string[]) {
        this.matchTags = tags;
    }

    setTags(tags: string) {
        this.tags = tags;
    }

    setDeadline(deadline: Dayjs | undefined) {
        this.deadline = deadline;
    }

    setPriority(priority: string | undefined) {
        if (!priority) {
            this.priority = undefined;
            return;
        }

        const priorityNumber = Number.parseInt(priority, 10);
        this.priority = priorityNumber;
    }
}
