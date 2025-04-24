import { assertEquals } from "@std/assert/equals";
import { Project } from "ts-morph";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "./typescript.ts";

const filePath = new FilePath("./lib/typescript/typescript.test.ts");
const project = new Project();
project.addSourceFileAtPath(filePath.filePath);

@Derive(TypeScriptClassDeclaration.getOrThrow(project))
@Derive(filePath)
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example",
  fn: () => {
    const actual =
      getDerivedValue<TypeScriptClassDeclaration>(Person).declaration;
    assertEquals(actual.name, "Person");
  },
});
