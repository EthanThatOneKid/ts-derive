import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "./typescript.ts";

@Derive(await TypeScriptClassDeclaration.autoGetOrThrow())
@Derive(FilePath.from(import.meta))
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<TypeScriptClassDeclaration>(Person);
    assertEquals(actual.declaration.name, "Person");
  },
});
