import type { AnyZodObject, SafeParseReturnType, ZodRawShape } from "zod";
import { Zod as TypeMapToZod } from "@sinclair/typemap";
import type { JSONSchema } from "../json-schema/json-schema.ts";

export type { AnyZodObject, SafeParseReturnType };

/**
 * ZodObject is a Zod schema with generic methods.
 */
export type ZodObject = AnyZodObject & {
  safeParse<Input = ZodRawShape, Output = Input>(
    value: Input,
  ): SafeParseReturnType<Input, Output>;
  safeParseAsync<Input = ZodRawShape, Output = Input>(
    value: Input,
  ): Promise<SafeParseReturnType<Input, Output>>;
  parse<Input = ZodRawShape, Output = Input>(value: Input): Output;
  parseAsync<Input = ZodRawShape, Output = Input>(
    value: Input,
  ): Promise<Output>;
};

/**
 * Zod is the Zod schema representation of a class.
 */
export class Zod {
  /**
   * constructor is the constructor of the Zod class.
   */
  public constructor(
    /**
     * zodObject is the Zod schema of a class.
     */
    public zodObject: ZodObject,
  ) {}

  /**
   * auto is a static method that returns a Zod schema by its JSONSchema
   * representation.
   */
  public static auto(
    schema = (zodObject: ZodObject) => zodObject,
  ): (value: JSONSchema) => Zod {
    return ({ jsonSchema }: JSONSchema): Zod => {
      return new Zod(schema(TypeMapToZod(jsonSchema)));
    };
  }
}
