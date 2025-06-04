import { Sketch } from "@/models/sketch.model";
import { rootStore, RootStore } from "./root.store";
import { AbstractStore } from "./abstract.store";
import { z } from "zod";

const ALL_SKETCHES_KEY = "p6n-all-sketches";

const sketchArraySchema = z.array(z.string());

export class SketchesStore extends AbstractStore<Sketch> {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    super(rootStore);
    this.rootStore = rootStore;
  }

  loadAllSketches() {
    // local from local storage all the local storage keys
    const sketches = localStorage.getItem(ALL_SKETCHES_KEY);
    if (!sketches) return [];
    const sketchesArray = JSON.parse(sketches);

    const parsedSketches = sketchArraySchema.safeParse(sketchesArray);
    if (!parsedSketches.success) return [];

    parsedSketches.data.forEach((id: string) => {
      this.loadSketch(id);
    });
  }

  loadSketch(id: string) {
    const sketch = new Sketch({
      id
    });
    sketch.load(id);
    this.setById(id, sketch);
  }
}
