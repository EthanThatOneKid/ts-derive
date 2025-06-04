import { assertEquals } from "@std/assert";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { classDeclaration } from "../typescript/auto.ts";
import { jsonSchema } from "../json-schema/json-schema.ts";
import type { StandardSchema } from "./standard-schema.ts";
import { standardSchema } from "./standard-schema.ts";

const filePath = FilePath.fromMeta(import.meta);

@derive(filePath, classDeclaration, jsonSchema, standardSchema)
class Person {
  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive StandardSchema example",
  fn: async (t) => {
    const standardSchema =
      getDerivedValue<StandardSchema>(Person).standardSchemaV1["~standard"];

    await t.step("Standard Schema validates valid instance", async () => {
      const validPerson = new Person("Ash");
      const result = await standardSchema.validate(validPerson);
      assertEquals(result.issues, undefined);
    });

    await t.step(
      "Standard Schema does not validate invalid instance",
      async () => {
        const invalidPerson = new Person(0 as unknown as string);
        const result = await standardSchema.validate(invalidPerson);
        assertEquals(result.issues?.length, 1);
        assertEquals(result.issues?.[0].message, "Expected string");
      },
    );
  },
});
