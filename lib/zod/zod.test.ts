import { assert } from "@std/assert/assert";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { ZodObject } from "./zod.ts";

const Derive = createDerive([FilePath.from(import.meta)]);

@Derive(ZodObject.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive ZodObject example",
  fn: () => {
    const personSchema = getDerivedValue<ZodObject>(Person).zodObject;
    assert(personSchema.safeParse({ givenName: "Ethan" }).success);
  },
});

@Derive(
  ZodObject.auto((schema) =>
    schema.describe("Entities that have a somewhat fixed, physical extension.")
  ),
)
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
class Place {
  public constructor(public address: string) {}
}

Deno.test({
  name: "Derive ZodObject extended example",
  fn: () => {
    const placeSchema = getDerivedValue<ZodObject>(Place).zodObject;
    assert(placeSchema.safeParse({ address: "123 Main St" }).success);
  },
});
