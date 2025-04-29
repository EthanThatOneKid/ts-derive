import type { JSONSchema } from "../json-schema/json-schema.ts";
import type { JSONSchemaObject } from "../json-schema/shared.ts";

/**
 * Generate derives generated code.
 */
export class Generate {
  /**
   * constructor is the constructor of the Generate class.
   */
  public constructor(
    /**
     * generate is the function that generates code.
     */
    public generate: () => Promise<void>,
  ) {}

  /**
   * jsonSchema writes the JSON Schema representation of a class to a file.
   */
  public static jsonSchema(write: (result: JSONSchemaObject) => Promise<void>) {
    return (({ jsonSchema }: JSONSchema) => {
      return new Generate(async () => {
        await write(jsonSchema);
      });
    });
  }
}
