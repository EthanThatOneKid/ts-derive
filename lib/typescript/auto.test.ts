import { assertEquals } from "@std/assert/equals";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "./typescript.ts";

const defaultItem = await ClassDeclaration.auto();
const derive = createDerive((items) => [...items, defaultItem]);

@derive(FilePath.from(import.meta))
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<ClassDeclaration>(Person);
    assertEquals(actual.classDeclaration.name, "Person");
  },
});
