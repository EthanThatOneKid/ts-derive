// import type { TypeScriptClassDeclaration } from "../typescript/typescript.ts";

/**
 * JSONSchemaObject is the JSONSchema representation of a class.
 */
// deno-lint-ignore no-explicit-any
export type JSONSchemaObject = any;

/**
 * JSONSchema is the JSONSchema representation of a class.
 */
export class JSONSchema {
  public constructor(public jsonSchema: JSONSchemaObject) {}

  //   public static auto() {
  //     return ({ classDeclaration }: TypeScriptClassDeclaration): JSONSchema => {
  //       const jsonSchema = TypeBoxFromSyntax(classDeclaration);
  //       return new JSONSchema(classDeclaration);
  //     };
  //   }
}
