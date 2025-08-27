"use client";

import { action, computed, makeObservable, observable, reaction } from "mobx";
import type { RootStore } from "@/stores/root.store";

export type ViewItem = {
	id: string;
	smallId: string;
	name: string;
	type: string;
	createdAt: Date;
};

// a view is a way of interacting with the data on the app
// each view can have custom filters, search and order
export abstract class AbstractView<T extends ViewItem> {
	rootStore: RootStore;

	bodyRef: React.RefObject<HTMLDivElement | null> | null = null;
	searchInputRef: React.RefObject<HTMLInputElement | null> | null = null;

	_lastHoveredIndex: number | null = null;
	_lastHoveredDocumentId: string | null = null;

	_selectedIndex = -1;

	query: string;

	renderableItems: T[] = [];

	checkedItems: Map<string, boolean> = new Map();

	constructor(rootStore: RootStore) {
		this.rootStore = rootStore;
		this.query = "";

		makeObservable(this, {
			_selectedIndex: observable,
			query: observable,
			setSearchQuery: action,
			setSelectedIndex: action,
			search: action,
			getItems: computed,
			getAllItems: computed,
			renderableItems: observable,
			computeRenderableItems: action,
			checkedItems: observable,
			checkItem: action,
		});

		reaction(
			() => this.query,
			() => {
				this.computeRenderableItems();
			},
		);

		reaction(
			() => this.getAllItems,
			() => {
				this.computeRenderableItems();
			},
			{
				delay: 25,
			},
		);
	}

	setSearchQuery(query: string) {
		this.query = query;
	}

	/*
	 * @returns the all the possible items to display in the view
	 */
	abstract get getAllItems(): T[];

	computeRenderableItems() {
		const allItems = this.getAllItems;
		const searchedItems = this.search(allItems);
		const filteredItems = this.filterBy(searchedItems);
		const orderedItems = this.orderBy(filteredItems);

		this.renderableItems = orderedItems;
	}

	/*
	 * @returns the items to display in the view
	 * @note this is the items that are currently displayed in the view (after filters, search, etc.)
	 */
	get getItems(): T[] {
		return this.renderableItems;
	}

	/*
	 * @param context - the context to use for ordering
	 * @param items - the items to order
	 * @returns the ordered items
	 */
	abstract orderBy(items: T[]): T[];

	/*
	 * @param query - the query to search for
	 * @param items - the items to search in
	 * @returns the items that match the query
	 */
	abstract search(items: T[]): T[];

	/*
	 * @param filters - the filters to apply to the items
	 * @param items - the items to filter
	 * @returns the filtered items
	 */
	abstract filterBy(items: T[]): T[];

	/*
	 * @returns the columns to display in the view
	 */
	abstract displayColumns(): string[];

	/*
	 * @param items - the items to group
	 * @returns the grouped items
	 */
	abstract groupBy(items: T[]): Record<string, T[]>;

	/*
	 * @returns the selected index
	 */
	getSelectedIndex() {
		return this._selectedIndex;
	}

	/*
	 * @param index - the index to set as selected
	 */
	setSelectedIndex(_index: number) {
		let index = _index;
		// -1 is the exception
		if (index === -1) {
			this._selectedIndex = -1;
			return;
		}

		if (index > this.getItems.length) {
			console.error("index is greater than the number of items");
			index = this.getItems.length - 1;
		}

		if (index < 0) {
			console.error("index is less than 0");
			index = 0;
		}

		this._selectedIndex = index;

		return this._selectedIndex;
	}

	/*
	 * @param element - the element to set as last hovered element
	 */
	setLastHoveredElement(element: HTMLElement) {
		this._lastHoveredIndex = Number(element.getAttribute("data-list-index"));
		this._lastHoveredDocumentId = element.getAttribute("data-document-id");
	}

	getLastIndex() {
		// if the user is hovering an element, use the last hovered index
		const lastIndexFromHover = this._lastHoveredIndex;
		if (lastIndexFromHover) {
			this._lastHoveredIndex = null;
			return Number(lastIndexFromHover);
		}

		return this._selectedIndex;
	}

	goDown() {
		let tmpIndex = this.getLastIndex();
		tmpIndex++;
		if (tmpIndex >= this.getItems.length) {
			tmpIndex = 0;
		}

		this.setSelectedIndex(tmpIndex);
	}

	goUp() {
		let tmpIndex = this.getLastIndex();
		tmpIndex--;

		if (tmpIndex < 0) {
			tmpIndex = this.getItems.length - 1;
		}

		this.setSelectedIndex(tmpIndex);
	}

	currentItem() {
		const index = this.getSelectedIndex();

		return this.getItems[index];
	}

	checkItem(item: T, forceTrue?: boolean) {
		const isChecked = this.checkedItems.get(item.id);

		if (forceTrue) {
			this.checkedItems.set(item.id, true);
			return;
		}

		if (isChecked) {
			this.checkedItems.delete(item.id);
		} else {
			this.checkedItems.set(item.id, true);
		}
	}

	isItemChecked(item: T) {
		return this.checkedItems.get(item.id) ?? false;
	}
}
