"use client";

import { isEqual } from "lodash";
import { action, computed, makeObservable, observable, reaction } from "mobx";

export type ViewItem = {
	_id: string;
	smallId: string;
	title: string;
	type: string;
};

// a view is a way of interacting with the data on the app
// each view can have custom filters, search and order
export abstract class AbstractView<T extends { _id: string }> {
	bodyRef: React.RefObject<HTMLDivElement | null> | null = null;
	searchInputRef: React.RefObject<HTMLInputElement | null> | null = null;

	_lastHoveredIndex: number | null = null;
	_lastHoveredDocumentId: string | null = null;

	_selectedIndex = -1;
	_selectedId: string | null = null;
	_numberOfItems = 0;

	query: string;

	baseItems: Map<string, T> = new Map();
	renderableItems: T[] = [];

	checkedItems: Map<string, boolean> = new Map();

	constructor() {
		this.query = "";

		makeObservable(this, {
			_selectedIndex: observable,
			query: observable,
			setSearchQuery: action,
			setSelectedIndex: action,
			search: action,
			getItems: computed,
			baseItems: observable,
			renderableItems: observable,
			computeRenderableItems: action,
			checkedItems: observable,
			checkItem: action,
			updateData: action,
		});

		reaction(
			() => this.query,
			() => {
				this.computeRenderableItems();
			},
		);

		// reaction(
		// 	() => this.baseItems,
		// 	() => {
		// 		this.computeRenderableItems();
		// 	},
		// );
	}

	// we update all the element who have changed
	updateData(items: T[]) {
		for (const item of items) {
			if (this.baseItems.has(item._id)) {
				// if the item are the same, we keep them that way
				// and go to the next item
				if (isEqual(this.baseItems.get(item._id), item)) {
					continue;
				}
			}

			this.baseItems.set(item._id, item);
		}

		console.log("baseItems", this.baseItems.size);
	}

	setSearchQuery(query: string) {
		this.query = query;
	}

	setItems(items: T[]) {
		this._numberOfItems = items.length;
	}

	computeRenderableItems() {
		const allItems = this.baseItems.values().toArray();
		// const searchedItems = this.search(allItems);
		// const filteredItems = this.filterBy(searchedItems);
		// const orderedItems = this.orderBy(filteredItems);

		this.renderableItems = allItems;
	}

	/*
	 * @returns the items to display in the view
	 * @note this is the items that are currently displayed in the view (after filters, search, etc.)
	 */
	get getItems(): T[] {
		const items = this.baseItems.values().toArray();
		const orderedItems = this.orderBy(items);
		const filteredItems = this.filterBy(orderedItems);
		const searchedItems = this.search(filteredItems);

		return searchedItems;
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

	getSelectedId() {
		return this._selectedId;
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

		if (index > this.baseItems.size) {
			console.error("index is greater than the number of items");
			index = this.baseItems.size - 1;
		}

		if (index < 0) {
			console.error("index is less than 0");
			index = 0;
		}

		this._selectedIndex = index;
		this._selectedId = this.baseItems.values().toArray()[index]._id;

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
		if (tmpIndex >= this.baseItems.size) {
			tmpIndex = 0;
		}

		this.setSelectedIndex(tmpIndex);
	}

	goUp() {
		let tmpIndex = this.getLastIndex();
		tmpIndex--;

		if (tmpIndex < 0) {
			tmpIndex = this.baseItems.size - 1;
		}

		this.setSelectedIndex(tmpIndex);
	}

	currentItem() {
		const index = this.getSelectedIndex();

		const item = this.baseItems.values().toArray()[index];
		return item;
	}

	checkItem(item: T, forceTrue?: boolean) {
		const isChecked = this.checkedItems.get(item._id);

		if (forceTrue) {
			this.checkedItems.set(item._id, true);
			return;
		}

		if (isChecked) {
			this.checkedItems.delete(item._id);
		} else {
			this.checkedItems.set(item._id, true);
		}
	}

	isItemChecked(item: T) {
		return this.checkedItems.get(item._id) ?? false;
	}
}
