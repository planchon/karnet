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
}
