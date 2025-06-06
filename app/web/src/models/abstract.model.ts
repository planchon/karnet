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
  id: string = generateId();

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

  constructor(props: Partial<AbstractModel>) {
    Object.assign(this, props);
    this.validate();
  }

  validate(): ValidationError[] {
    return validateClassValidator(this);
  }

  abstract toJSON(): unknown;

  // return a safe stringified JSON of the model
  serialize() {
    return superjson.stringify(this.toJSON());
  }

  deserialize(data: string) {
    const parsed = superjson.parse(data);
    Object.assign(this, parsed);
    this.validate();
  }

  // save to local storage
  saveToLocalStorage() {
    const serialized = this.serialize();
    if (window.DEBUG) {
      console.log("saving to local storage", this.key);
      console.log("serialized", serialized);
    }
    localStorage.setItem(this.key, serialized);
  }

  // load from local storage
  loadFromLocalStorage() {
    const serialized = localStorage.getItem(this.key);
    if (window.DEBUG) {
      console.log("loading from local storage", this.key);
      console.log("serialized", serialized);
    }
    if (!serialized) return;
    this.deserialize(serialized);
  }
}
