import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { SourceCode } from "./source-code.ts";

Deno.test({
  name: "Derive decorator example",
  permissions: { read: true },
  fn: async () => {
    const sourceCodePath = new URL("./example.ts", import.meta.url);
    const sourceCode = await Deno.readTextFile(sourceCodePath);

    @Derive(() => new SourceCode(sourceCode))
    class Person {}

    const actual = getDerivedValue<SourceCode>(Person).sourceCode;
    assertEquals(actual, "// Example.\n");
  },
});
