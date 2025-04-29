import type { AnyZodObject } from "zod";
import { Zod } from "@sinclair/typemap";
import type { JSONSchema } from "./json-schema.ts";

export type { AnyZodObject };

/**
 * ZodSchema is the Zod schema representation of a class.
 */
export class ZodObject {
  /**
   * constructor is the constructor of the SourceCode class.
   */
  public constructor(
    /**
     * zodObject is the Zod schema of a class.
     */
    public zodObject: AnyZodObject,
  ) {}

  /**
   * auto is a static method that returns a Zod schema by its JSONSchema
   * representation.
   */
  public static auto() {
    return ({ jsonSchema }: JSONSchema): ZodObject => {
      return new ZodObject(Zod(jsonSchema) as unknown as AnyZodObject);
    };
  }
}
