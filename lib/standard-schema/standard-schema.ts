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
  /**
   * constructor creates a Standard Schema.
   */
  public constructor(public standardSchemaV1: StandardSchemaV1) {}

  // TODO: Associate class with JSON Schema dependencies that are referenced
  // by the class.

  /**
   * auto is a static method that returns a Standard Schema by its JSONSchema
   * representation.
   */
  public static auto(): (value: JSONSchema) => StandardSchema {
    return ({ jsonSchema }: JSONSchema): StandardSchema => {
      return new StandardSchema(Compile(jsonSchema));
    };
  }
}
