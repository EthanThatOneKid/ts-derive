import { assertEquals } from "@std/assert/equals";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "./file-path.ts";

const filePath = FilePath.fromMeta(import.meta);

@derive(filePath)
class Person {}

Deno.test({
  name: "Derive FilePath example",
  fn: () => {
    const actual = getDerivedValue<FilePath>(Person).filePath;
    assertEquals(actual, import.meta.url.replace(/^file:\/\/\//, ""));
  },
});
