import { Sketch } from "@/models/sketch.model";
import { RootStore } from "./root.store";
import { AbstractStore } from "./abstract.store";
import { z } from "zod";

const ALL_SKETCHES_KEY = "p6n-all-sketches";

const sketchArraySchema = z.array(z.string());

export class SketchesStore extends AbstractStore<Sketch> {
  store_key = ALL_SKETCHES_KEY;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  loadInMemory(id: string | undefined): Sketch {
    if (id === undefined) throw new Error("Id is undefined");
    const sketch = new Sketch({ id });
    console.log("load in memory sketch", sketch);
    return sketch;
  }

  createNewModel(id: string): Sketch {
    const sketch = new Sketch({ id });
    sketch.smallId = `SKT-${Object.keys(this._models).length + 1}`;
    sketch.save();
    this._models[id] = sketch;
    this.save();
    return sketch;
  }
}
