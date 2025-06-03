import type { SchemaOptions, TParameters } from "@sinclair/typebox";
import type { TTypeBox } from "@sinclair/typemap";
import { TypeBoxFromSyntax } from "@sinclair/typemap";
import type { ClassDeclaration } from "../typescript/typescript.ts";
import { serialize } from "./auto-schema.ts";

/**
 * JSONSchemaOptions are options for `JSONSchema`.
 */
export interface JSONSchemaOptions {
  /**
   * context are the references to the classes that are used in the class
   * declaration.
   *
   * @see
   * https://github.com/sinclairzx81/typemap?tab=readme-ov-file#parameters
   */
  // deno-lint-ignore no-explicit-any
  context: TParameters<any>;

  /**
   * schemaOptions are options for `@sinclar/typebox`.
   */
  schemaOptions?: SchemaOptions;
}

/**
 * JSONSchemaObject is the JSON Schema representation of a class.
 */
// deno-lint-ignore no-explicit-any
export type JSONSchemaObject = TTypeBox<any, any, any>;

/**
 * JSONSchema is the JSON Schema representation of a class.
 *
 * @see https://json-schema.org
 */
export class JSONSchema {
  /**
   * constructor creates a JSON Schema specification.
   */
  public constructor(public jsonSchema: JSONSchemaObject) {}

  // TODO: Associate class with JSONSchema dependencies that are referenced
  // by the class.

  /**
   * auto is a static method that returns a JSONSchema by its ClassDeclaration
   * representation.
   */
  public static auto(
    options?: JSONSchemaOptions,
  ): (value: ClassDeclaration) => JSONSchema {
    return ({ classDeclaration }: ClassDeclaration): JSONSchema => {
      return new JSONSchema(
        TypeBoxFromSyntax(
          options?.context ?? {},
          serialize(classDeclaration),
          options?.schemaOptions,
        ),
      );
    };
  }
}

/**
 * jsonSchema is a derive operation that automatically returns
 * a JSONSchema by its ClassDeclaration representation.
 */
export const jsonSchema: (value: ClassDeclaration) => JSONSchema = JSONSchema
  .auto();
