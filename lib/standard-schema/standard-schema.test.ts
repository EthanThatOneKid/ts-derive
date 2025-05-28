import { assertEquals } from "@std/assert";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { StandardSchema } from "./standard-schema.ts";

@derive(StandardSchema.auto())
@derive(JSONSchema.auto())
@derive(await ClassDeclaration.auto())
@derive(FilePath.from(import.meta))
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
