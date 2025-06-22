import superjson from "superjson";
import { generateId } from "@/lib/utils";
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  Length,
  validateSync as validateClassValidator,
  ValidationError
} from "class-validator";

declare global {
  interface Window {
    DEBUG: boolean;
  }
}

window.DEBUG = true;

export abstract class AbstractModel {
  @Length(21)
  @IsString()
  @IsNotEmpty()
  id: string = "no_id";

  @IsString()
  @IsNotEmpty()
  smallId: string = "";

  @IsDate()
  createdAt: Date = new Date();

  @IsDate()
  updatedAt: Date = new Date();

  @IsDate()
  @IsOptional()
  deletedAt: Date | null = null;

  @IsString()
  @IsNotEmpty()
  model_name: string = this.constructor.name;

  @IsString()
  @IsNotEmpty()
  key: string = `p6n-models-${this.model_name}-${this.id}`;

  constructor(props: Partial<AbstractModel> & { id: string }) {
    // assign ids
    Object.assign(this, props);
  }

  validate(): ValidationError[] {
    return validateClassValidator(this);
  }

  abstract toJSON(): unknown;
  abstract _id(): string;

  // load the model from local storage
  load() {
    const serialized = localStorage.getItem(this._id());
    if (!serialized) {
      console.error("No model found in local storage", this._id());
      return;
    }
    const parsed = JSON.parse(serialized);
    Object.assign(this, parsed);
    this.validate();
  }

  save() {
    console.log("saving model", this._id());
    localStorage.setItem(this._id(), JSON.stringify(this.toJSON()));
  }
}
