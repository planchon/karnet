import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";

export class DocumentStore extends AbstractStore<Document> {
  constructor(rootStore: RootStore) {
    super(rootStore);
  }
}
