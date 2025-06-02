import superjson from "superjson";
import { nanoid } from "nanoid";
import z from "zod";

const abstractModelSchema = z.object({
  id: z.string().default(nanoid()),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
  deletedAt: z.date().nullable(),
  model_version: z.number().default(1)
});

export abstract class AbstractModel {
  __schema = abstractModelSchema;

  constructor(props: Partial<AbstractModel>) {
    const staticMembers = this.getStaticMembers(this.__schema.shape);
    Object.assign(this, staticMembers);
    Object.assign(this, props);
  }

  getStaticMembers(shape: z.ZodRawShape) {
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [toPascalCase(key), value])
    );
  }

  abstract toJSON(): unknown;

  // return a safe stringified JSON of the model
  serialize() {
    return superjson.stringify(this.toJSON());
  }

  deserialize(data: string) {
    const parsed = superjson.parse(data);
    return this.__schema.parse(parsed);
  }
}

export function toPascalCase(str: string): string {
  return (
    str
      // Split on non-word characters, underscores, spaces, or boundaries between a lower-case letter and an upper-case letter, or a number and a letter
      .split(/\W|_|\s+|(?<=[a-z])(?=[A-Z])|(?<=[0-9])(?=[A-Za-z])/)
      // Capitalize the first letter of each word and join them together
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("")
  );
}
