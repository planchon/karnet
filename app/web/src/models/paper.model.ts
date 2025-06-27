import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";
import { IsString, IsNotEmpty } from "class-validator";

// this model is only used to store the metadata of the document
// everything else is stored in the document itself
// tiptap is storing the content by itself
export class PaperModel extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Default paper name";

  constructor(
    props: Partial<PaperModel> & {
      id: string;
    }
  ) {
    super(props);

    makeObservable(this, {
      name: observable
    });

    this.load();

    reaction(
      () => this.toJSON(),
      () => {
        this.save();
      },
      {
        delay: 1000
      }
    );
  }

  toJSON() {
    return {
      ...this
    };
  }

  getSmallId(id: number): string {
    return `DOCS-${id}`;
  }

  _id() {
    return `p6n-paper-metadata-${this.id}`;
  }
}
