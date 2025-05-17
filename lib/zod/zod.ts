import type { AnyZodObject } from "zod";
import { Zod } from "@sinclair/typemap";
import type { JSONSchema } from "../json-schema/json-schema.ts";

export type { AnyZodObject };

/**
 * ZodObject is the Zod schema representation of a class.
 */
export class ZodObject {
  /**
   * constructor is the constructor of the ZodObject class.
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
  public static auto(
    schema = (zodObject: AnyZodObject) => zodObject,
  ): (value: JSONSchema) => ZodObject {
    return ({ jsonSchema }: JSONSchema): ZodObject => {
      return new ZodObject(schema(Zod(jsonSchema)));
    };
  }
}
