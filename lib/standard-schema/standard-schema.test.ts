import { assertEquals } from "@std/assert";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { StandardSchema } from "./standard-schema.ts";

@Derive(StandardSchema.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive StandardSchema example",
  fn: async (t) => {
    const { standardSchema } = getDerivedValue<StandardSchema>(Person);

    await t.step("Standard Schema validates valid instance", () => {
      const validPerson = new Person("Ash");
      const result = standardSchema["~standard"].validate(validPerson);
      assertEquals(result.issues, undefined);
    });

    await t.step("Standard Schema does not validate invalid instance", () => {
      const invalidPerson = new Person(0 as unknown as string);
      const result = standardSchema["~standard"].validate(invalidPerson);
      assertEquals(result.issues?.length, 1);
      assertEquals(result.issues?.[0].message, "Expected string");
    });
  },
});
