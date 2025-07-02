import { action, makeObservable, observable, reaction, toJS } from "mobx";
import { AbstractModel } from "./abstract.model";
import { IsString, IsNotEmpty } from "class-validator";

// this model is only used to store the metadata of the document
// everything else is stored in the document itself
// tiptap is storing the content by itself
export class PaperModel extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Default paper name";

  content: unknown = {
    type: "doc",
    content: []
  };

  constructor(
    props: Partial<PaperModel> & {
      id: string;
    }
  ) {
    super(props);

    makeObservable(this, {
      name: observable,
      content: observable,
      setContent: action,
      getContent: action
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

    reaction(
      () => this.content,
      () => {
        console.log("saving other");
        this.save();
      },
      {
        delay: 500
      }
    );
  }

  toJSON() {
    return toJS(this);
  }

  getSmallId(id: number): string {
    return `DOCS-${id}`;
  }

  setContent(content: unknown) {
    this.content = content;
  }

  getContent() {
    return toJS(this.content);
  }

  _id() {
    return `p6n-paper-metadata-${this.id}`;
  }
}
