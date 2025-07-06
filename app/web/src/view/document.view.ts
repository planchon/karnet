import { RootStore } from "@/stores/root.store";
import { AbstractView, ViewItem } from "./abstract.view";
import { action, makeObservable, observable } from "mobx";
import { DiagramModel } from "@/models/diagram.model";
import { PaperModel } from "@/models/paper.model";
import { SketchModel } from "@/models/sketch.model";

type DocumentItem = PaperModel | SketchModel | DiagramModel;

export class DocumentView extends AbstractView<DocumentItem> {
  order: string = "createdAt";
  filters: Record<string, any> = {};
  groups: Record<string, any> = {};
  display: string[] = ["id", "name", "createdAt"];

  constructor(rootStore: RootStore) {
    super(rootStore);

    makeObservable(this, {
      query: observable,
      setSearchQuery: action,
      getAllItems: action,
      orderBy: action,
      search: action,
      filterBy: action,
      displayColumns: action,
      groupBy: action
    });
  }

  getAllItems() {
    const documents = this.rootStore.paperStore.allModels();
    const sketches = this.rootStore.sketchesStore.allModels();
    const diagrams = this.rootStore.diagramStore.allModels();

    const rawItems = [...documents, ...sketches, ...diagrams];

    return rawItems;
  }

  orderBy(items: DocumentItem[]) {
    return items;
  }

  search(items: DocumentItem[]) {
    return items.filter((item) =>
      item.name.toLowerCase().includes(this.query.toLowerCase())
    );
  }

  filterBy(items: DocumentItem[]) {
    return items;
  }

  displayColumns() {
    return this.display;
  }

  groupBy(items: DocumentItem[]): Record<string, DocumentItem[]> {
    return {
      all: items
    };
  }
}
