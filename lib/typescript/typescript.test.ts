import { assertEquals } from "@std/assert/equals";
import { Project } from "ts-morph";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "./typescript.ts";

const filePath = FilePath.fromMeta(import.meta);
const project = new Project();
project.addSourceFileAtPath(filePath.filePath);

const classDeclaration = ClassDeclaration.getOrThrow(project);

@derive(filePath, classDeclaration)
class Person {}

Deno.test({
  name: "Derive ClassDeclaration example",
  fn: () => {
    const actual = getDerivedValue<ClassDeclaration>(Person).classDeclaration;
    assertEquals(actual.name, "Person");
  },
});
