import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "./file-path.ts";

@Derive(FilePath.from(import.meta))
class Person {}

Deno.test({
  name: "Derive FilePath example",
  fn: () => {
    const actual = getDerivedValue<FilePath>(Person).filePath;
    assertEquals(actual, import.meta.url.replace(/^file:\/\/\//, ""));
  },
});
