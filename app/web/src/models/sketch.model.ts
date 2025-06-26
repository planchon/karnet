import { IsNotEmpty, IsString } from "class-validator";
import { AbstractModel } from "./abstract.model";
import { action, makeObservable, observable, reaction } from "mobx";

// this model is only used to store the metadata of the sketch
// everything else is stored in the sketch itself
// tldraw is storing the content by itself
export class SketchModel extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Untitled sketch";

  constructor(props: Partial<SketchModel> & { id: string }) {
    super(props);

    makeObservable(this, {
      name: observable,
      setName: action
    });

    this.load();

    reaction(
      () => this.name,
      () => {
        this.save();
      },
      {
        delay: 100
      }
    );
  }

  _id() {
    return `p6n-sketch-metadata-${this.id}`;
  }

  toJSON() {
    return {
      ...this
    };
  }

  setName(name: string) {
    this.name = name;
  }
}
