import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";
import { IsString, IsNotEmpty } from "class-validator";

// this model is only used to store the metadata of the document
// everything else is stored in the document itself
// tiptap is storing the content by itself
export class Document extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Default document name";

  constructor(props: Partial<Document> & { id: string }) {
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

  _id() {
    return `p6n-file-metadata-${this.id}`;
  }
}
