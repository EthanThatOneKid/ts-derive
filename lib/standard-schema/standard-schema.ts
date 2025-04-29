import type { StandardSchemaV1 } from "@standard-schema/spec";
import { Compile } from "@sinclair/typemap";
import type { JSONSchema } from "../json-schema/json-schema.ts";

export type { StandardSchemaV1 };

/**
 * StandardSchema is the Standard Schema representation of a class.
 *
 * @see https://standardschema.dev/
 */
export class StandardSchema {
  public constructor(public standardSchemaV1: StandardSchemaV1) {}

  // TODO: Associate class with JSONSchema dependencies that are referenced
  // by the class.

  public static auto() {
    return ({ jsonSchema }: JSONSchema): StandardSchema => {
      return new StandardSchema(Compile(jsonSchema));
    };
  }
}
