import { assertEquals } from "@std/assert/equals";
import { Project } from "ts-morph";
import { Derive, getDerivedValue } from "../../derive.ts";
import { TypeScriptClassDeclaration } from "./typescript.ts";

const specifier = "./lib/typescript/typescript.test.ts";
const project = new Project();
project.addSourceFileAtPath(specifier);

@Derive(TypeScriptClassDeclaration.getOrThrow(specifier, "Person", project))
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example",
  fn: () => {
    const actual =
      getDerivedValue<TypeScriptClassDeclaration>(Person).declaration;
    assertEquals(actual.name, "Person");
  },
});
