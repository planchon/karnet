import { IsJSON, IsNotEmpty, IsString } from "class-validator";
import { AbstractModel } from "./abstract.model";

export class Sketch extends AbstractModel {
  @IsJSON()
  snapshot: object = {};

  @IsString()
  @IsNotEmpty()
  name: string = "Sketch";

  model_name: string = "sketches";

  constructor(props: Partial<Sketch>) {
    super(props);
  }

  load(id: string) {
    const sketch = localStorage.getItem(`p6n-sketches-${id}`);
    if (!sketch) return null;
    const parsed = JSON.parse(sketch);
    Object.assign(this, parsed);
    this.validate();
  }

  toJSON() {
    return {
      ...this
    };
  }
}
