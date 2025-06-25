import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";
import { Mermaid } from "@/models/mermaid.model";

const ALL_MERMAIDS_KEY = "p6n-all-mermaids";

export class MermaidStore extends AbstractStore<Mermaid> {
  store_key = ALL_MERMAIDS_KEY;

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  loadInMemory(id: string | undefined): Mermaid {
    if (id === undefined) throw new Error("Id is undefined");
    return new Mermaid({ id });
  }

  createNewModel(id: string): Mermaid {
    const mermaid = new Mermaid({ id });
    mermaid.smallId = `MRM-${Object.keys(this._models).length + 1}`;
    mermaid.save();
    this._models[id] = mermaid;
    this.save();
    return mermaid;
  }
}
