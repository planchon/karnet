import { AbstractModel } from "@/models/abstract.model";
import { RootStore } from "@/stores/root.store";

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

  _lastHoveredElement: HTMLElement | null = null;
  _lastHoveredIndex: number | null = null;
  _lastHoveredDocumentId: string | null = null;

  _selectedIndex: number = -1;

  query: string = "";

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  setSearchQuery(query: string) {
    this.query = query;
  }

  /*
   * @returns the all the possible items to display in the view
   */
  abstract getAllItems(): T[];

  /*
   * @returns the items to display in the view
   * @note this is the items that are currently displayed in the view (after filters, search, etc.)
   */
  getItems(): T[] {
    const allItems = this.getAllItems();

    const searchedItems = this.search(allItems);
    const filteredItems = this.filterBy(searchedItems);
    const orderedItems = this.orderBy(filteredItems);

    return orderedItems;
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
   * @param element - the element to set as last hovered element
   */
  setLastHoveredElement(element: HTMLElement) {
    this._lastHoveredElement = element;
    this._lastHoveredIndex = Number(element.getAttribute("data-list-index"));
    this._lastHoveredDocumentId = element.getAttribute("data-document-id");
  }

  getLastIndex() {
    // if the user is hovering an element, use the last hovered index
    const lastIndexFromHover = this._lastHoveredIndex;
    if (lastIndexFromHover) {
      this._lastHoveredElement = null;
      return Number(lastIndexFromHover);
    }

    // otherwise, use the last selected index
    // if no index is selected, use the first index
    if (this._selectedIndex === -1) {
      this._selectedIndex = 0;
    }

    return this._selectedIndex;
  }

  goDown() {
    let tmpIndex = this.getLastIndex();
    tmpIndex++;

    if (tmpIndex >= this.getItems().length) {
      tmpIndex = 0;
    }

    this._selectedIndex = tmpIndex;
  }

  goUp() {
    let tmpIndex = this.getLastIndex();
    tmpIndex--;

    if (tmpIndex < 0) {
      tmpIndex = this.getItems().length - 1;
    }

    this._selectedIndex = tmpIndex;
  }
}
