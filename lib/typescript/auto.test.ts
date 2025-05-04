import { assertEquals } from "@std/assert/equals";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "./typescript.ts";

const Derive = createDerive([FilePath.from(import.meta)]);

@Derive(await TypeScriptClassDeclaration.auto())
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<TypeScriptClassDeclaration>(Person);
    assertEquals(actual.classDeclaration.name, "Person");
  },
});
