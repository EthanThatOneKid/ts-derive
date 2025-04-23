import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { SourceCode } from "./source-code.ts";

const sourceCodePath = new URL("./example.ts", import.meta.url);
const sourceCode = await Deno.readTextFile(sourceCodePath);

@Derive(new SourceCode(sourceCode))
class Person {}

Deno.test({
  name: "Derive SourceCode example",
  fn: () => {
    const actual = getDerivedValue<SourceCode>(Person).sourceCode;
    assertEquals(actual, "// Example.\n");
  },
});
