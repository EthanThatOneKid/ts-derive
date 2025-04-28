import type { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import type { JSONSchemaObject } from "./shared.ts";
import { compile } from "./auto-schema.ts";

/**
 * JSONSchema is the JSON Schema representation of a class.
 */
export class JSONSchema {
  public constructor(public jsonSchema: JSONSchemaObject) {}

  public static auto() {
    return ({ classDeclaration }: TypeScriptClassDeclaration): JSONSchema => {
      return new JSONSchema(compile(classDeclaration));
    };
  }
}
