"use client";

import type { Doc } from "@karnet/backend/convex/_generated/dataModel";
import { AbstractView } from "./abstract.view";

export class GenericView<T extends Doc<"tasks">> extends AbstractView<T> {
	get getAllItems(): T[] {
		return [];
	}

	orderBy(items: T[]): T[] {
		return items;
	}

	search(items: T[]): T[] {
		return items.filter((item) =>
			item.title.toLowerCase().includes(this.query.toLowerCase()),
		);
	}

	filterBy(items: T[]): T[] {
		return items;
	}

	displayColumns(): string[] {
		return ["id", "title", "completed", "createdAt", "targetDate"];
	}

	groupBy(items: T[]): Record<string, T[]> {
		return {
			all: items,
		};
	}
}
