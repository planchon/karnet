import { AbstractStore } from "./abstract.store";
import { RootStore } from "./root.store";
import { DiagramModel } from "@/models/diagram.model";

const ALL_DIAGRAMS_KEY = "p6n-all-diagrams";

export class DiagramStore extends AbstractStore<DiagramModel> {
  store_key = ALL_DIAGRAMS_KEY;
  store_name = "diagram";
  smallId = "DIAG";

  constructor(rootStore: RootStore) {
    super(rootStore);
  }

  loadInMemory(id: string | undefined): DiagramModel {
    if (id === undefined) throw new Error("Id is undefined");
    return new DiagramModel({ id });
  }

  createNewModel(id: string): DiagramModel {
    const diagram = new DiagramModel({ id });
    diagram.save();
    this._models[id] = diagram;
    this.save();
    return diagram;
  }
}
