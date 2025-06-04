import { assertEquals } from "@std/assert/equals";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import type { ClassDeclaration } from "./typescript.ts";
import { classDeclaration } from "./auto.ts";

const filePath = FilePath.fromMeta(import.meta);

@derive(filePath, classDeclaration)
class Person {}

Deno.test({
  name: "Derive ClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<ClassDeclaration>(Person);
    assertEquals(actual.classDeclaration.name, "Person");
  },
});
