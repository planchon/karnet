import { z } from "zod";
import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";
import { DocumentModel } from "@/models/document.model";

const ALL_DOCUMENTS_KEY = "p6n-all-documents";

const documentMetadataSchema = z.object({
  id: z.string()
});

const documentMetadataArraySchema = z.array(documentMetadataSchema);

export class DocumentStore extends AbstractStore<DocumentModel> {
  store_key = ALL_DOCUMENTS_KEY;

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  loadInMemory(id: string | undefined): DocumentModel {
    if (id === undefined) throw new Error("Id is undefined");
    return new DocumentModel({ id });
  }

  createNewModel(id: string): DocumentModel {
    const document = new DocumentModel({ id });
    document.smallId = `DOC-${Object.keys(this._models).length + 1}`;
    document.save();
    this._models[id] = document;
    this.save();
    return document;
  }
}
