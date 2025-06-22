import { AbstractModel } from "./abstract.model";
import { IsString, IsNotEmpty } from "class-validator";

export class Document extends AbstractModel {
  @IsString()
  @IsNotEmpty()
  name: string = "Document";

  model_name: string = "documents";

  constructor(props: Partial<Document>) {
    super(props);
  }

  toJSON() {
    return {
      ...this
    };
  }

  load(id: string) {
    const document = localStorage.getItem(`p6n-documents-${id}`);
    if (!document) return null;
    const parsed = JSON.parse(document);
    Object.assign(this, parsed);
    this.validate();
  }

  save() {
    localStorage.setItem(
      `p6n-documents-${this.id}`,
      JSON.stringify(this.toJSON())
    );
  }
}
