import { assertEquals } from "@std/assert";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { Generate } from "./codegen.ts";

const jsonSchemaPath = new URL(import.meta.resolve("./person.json"));

@Derive(Generate.jsonSchema(async (jsonSchema) => {
  await Deno.writeTextFile(jsonSchemaPath, JSON.stringify(jsonSchema));
}))
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive Generate.jsonSchema example",
  permissions: { read: true, write: true },
  fn: async (t) => {
    await t.step("Generate", async () => {
      const { generate } = getDerivedValue<Generate>(Person);
      await generate();
    });

    await t.step("Parse JSON Schema", async () => {
      const actual = JSON.parse(await Deno.readTextFile(jsonSchemaPath));
      assertEquals(actual.type, "object");
    });
  },
});
