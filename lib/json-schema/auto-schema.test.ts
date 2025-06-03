import { assert, assertEquals } from "@std/assert";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import type { ClassDeclaration } from "../typescript/typescript.ts";
import { classDeclaration } from "../typescript/typescript.ts";
import { serialize } from "./auto-schema.ts";
import type { JSONSchema } from "./json-schema.ts";
import { jsonSchema } from "./json-schema.ts";

const filePath = FilePath.fromMeta(import.meta);

@derive(filePath, classDeclaration, jsonSchema)
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive JSONSchema example",
  fn: () => {
    const actual = getDerivedValue<JSONSchema>(Person).jsonSchema;
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
