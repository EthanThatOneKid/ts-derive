import { assert, assertEquals } from "@std/assert";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "../typescript/typescript.ts";
import { serialize } from "./auto-schema.ts";
import { JSONSchema } from "./json-schema.ts";

const derive = createDerive([FilePath.from(import.meta)]);

@derive(JSONSchema.auto())
@derive(await ClassDeclaration.auto())
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive JSONSchema example",
  fn: () => {
    // deno-lint-ignore no-explicit-any
    const actual = getDerivedValue<any>(Person).jsonSchema;
    assertEquals(actual.properties.familyName.type, "string");
    assertEquals(actual.properties.givenName.type, "string");
    assertEquals(actual.required, ["givenName"]);
  },
});

Deno.test({
  name: "serialize serializes a valid class into an interface",
  fn: () => {
    const { classDeclaration } = getDerivedValue<ClassDeclaration>(Person);
    const actual = serialize(classDeclaration);
    assert(actual.includes("givenName: string;"));
    assert(actual.includes("familyName?: string;"));
  },
});
