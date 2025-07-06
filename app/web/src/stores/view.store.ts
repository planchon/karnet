import { makeAutoObservable } from "mobx";
import { RootStore } from "./root.store";
import { DocumentView } from "@/view/document.view";

export class ViewStore {
  rootStore: RootStore;

  documentView: Record<string | "default", DocumentView>;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    this.documentView = {
      default: new DocumentView(this.rootStore)
    };

    makeAutoObservable(this);
  }

  // get a document view by its id
  // its view may have different filters, order or display options
  getDocumentView(id: string = "default") {
    let existingView = this.documentView[id];

    if (!existingView) {
      throw new Error(`View with id ${id} not found`);
    }

    return existingView;
  }
}
