import { z } from "zod";
import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";
import { Document } from "@/models/document.model";

const ALL_DOCUMENTS_KEY = "p6n-all-documents";

const documentMetadataSchema = z.object({
  id: z.string()
});

const documentMetadataArraySchema = z.array(documentMetadataSchema);

export class DocumentStore extends AbstractStore<Document> {
  store_key = ALL_DOCUMENTS_KEY;

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  loadInMemory(id: string | undefined): Document {
    if (id === undefined) throw new Error("Id is undefined");
    return new Document({ id });
  }

  createNewModel(id: string): Document {
    const document = new Document({ id });
    document.smallId = `DOC-${Object.keys(this._models).length + 1}`;
    document.save();
    this._models[id] = document;
    this.save();
    return document;
  }
}
