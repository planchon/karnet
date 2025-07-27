import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  type ValidationError,
  validateSync as validateClassValidator,
} from 'class-validator';
import type { ViewItem } from '@/view/abstract.view';

declare global {
  interface Window {
    DEBUG: boolean;
  }
}

window.DEBUG = true;

export abstract class AbstractModel implements ViewItem {
  @Length(21)
  @IsString()
  @IsNotEmpty()
  id = 'no_id';

  @IsString()
  @IsNotEmpty()
  smallId = '';

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
  key = `p6n-models-${this.model_name}-${this.id}`;

  @IsString()
  name = '';

  @IsString()
  @IsNotEmpty()
  type = 'abstract';

  constructor(
    props: Partial<AbstractModel> & {
      id: string;
    }
  ) {
    // assign ids
    Object.assign(this, props);
  }

  validate(): ValidationError[] {
    return validateClassValidator(this);
  }

  abstract getSmallId(id: number): string;
  abstract toJSON(): unknown;
  abstract _id(): string;

  // load the model from local storage
  load() {
    const serialized = localStorage.getItem(this._id());
    if (!serialized) {
      console.debug('No model found in local storage', this._id());
      this.save();
      return;
    }
    const parsed = JSON.parse(serialized);
    Object.assign(this, parsed);
    this.validate();
  }

  save() {
    console.log('saving model', this._id());
    localStorage.setItem(this._id(), JSON.stringify(this.toJSON()));
  }
}
