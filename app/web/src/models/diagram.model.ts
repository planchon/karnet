import { makeObservable, observable, reaction } from "mobx";
import { AbstractModel } from "./abstract.model";
import { IsString, IsNotEmpty } from "class-validator";

export class DiagramModel extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  content: string = `sequenceDiagram
    Alice->John: Hello John, how are you?
    Note over Alice,John: A typical interaction
    John-->Alice: How are you?
    Alice->John: Great!
  `;

  @IsString()
  @IsNotEmpty()
  name: string = "Diagram name";

  constructor(props: Partial<DiagramModel> & { id: string }) {
    super(props);

    makeObservable(this, {
      content: observable,
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

  setName(name: string) {
    this.name = name;
  }

  _id() {
    return `p6n-diagram-${this.id}`;
  }
}
