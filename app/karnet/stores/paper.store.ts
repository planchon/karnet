import { z } from "zod";
import { PaperModel } from "@/models/paper.model";
import { AbstractStore } from "./abstract.store";

const ALL_PAPERS_KEY = "p6n-all-papers";

const documentMetadataSchema = z.object({
	id: z.string(),
});

const documentMetadataArraySchema = z.array(documentMetadataSchema);

export class PaperStore extends AbstractStore<PaperModel> {
		store_key = ALL_PAPERS_KEY;
		store_name = "paper";
		smallId = "DOCS";

		loadInMemory(id: string | undefined): PaperModel {
			if (id === undefined) throw new Error("Id is undefined");
			return new PaperModel({ id });
		}

		createNewModel(id: string): PaperModel {
			const document = new PaperModel({ id });
			document.smallId = `DOC-${this.getLength() + 1}`;
			document.save();
			this.setModel(id, document);
			this.save();
			return document;
		}
	}
