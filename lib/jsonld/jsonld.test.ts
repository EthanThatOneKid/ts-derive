import { assertEquals } from "@std/assert/equals";
import { derive, getDerivedValue } from "../../derive.ts";
import { JSONLd } from "./jsonld.ts";

@derive(JSONLd.context("https://schema.org/"))
class Person {}

Deno.test({
  name: "Derive JSONLd example",
  fn: () => {
    const { id, context } = getDerivedValue<JSONLd>(Person);
    assertEquals(id, "Person");
    assertEquals(context, "https://schema.org/");
  },
});
