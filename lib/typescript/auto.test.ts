import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { TypeScriptClassDeclaration } from "./typescript.ts";

const specifier = import.meta.url.replace(/^file:\/\/\//, "");

@Derive(await TypeScriptClassDeclaration.autoGetOrThrow(specifier, "Person"))
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<TypeScriptClassDeclaration>(Person);
    assertEquals(actual.declaration.name, "Person");
  },
});
