import { assert } from "@std/assert/assert";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "./json-schema.ts";
import { ZodObject } from "./zod-schema.ts";

@Derive(ZodObject.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive ZodSchema example",
  fn: () => {
    const personSchema = getDerivedValue<ZodObject>(Person).zodObject;
    assert(personSchema.safeParse({ givenName: "Ethan" }).success);
  },
});
