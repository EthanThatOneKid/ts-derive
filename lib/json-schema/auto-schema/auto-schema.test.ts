import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../../derive.ts";
import { FilePath } from "../../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../../typescript/typescript.ts";
import { serialize } from "./auto-schema.ts";

@Derive(await TypeScriptClassDeclaration.autoGetOrThrow())
@Derive(FilePath.from(import.meta))
class Person {
  public familyName?: string;
  public constructor(public givenName?: string) {}
}

Deno.test({
  name: "serialize serializes a valid class into an interface",
  fn: () => {
    const { classDeclaration } = getDerivedValue<TypeScriptClassDeclaration>(
      Person,
    );
    const actual = serialize(classDeclaration);
    assertEquals(
      actual,
      "interface Person {\n" +
        "    public familyName?: string;\n" +
        "    public givenName?: string;\n" +
        "}",
    );
  },
});
