import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { JSONLd } from "./jsonld.ts";

@Derive(JSONLd.context("https://schema.org/"))
class Person {}

Deno.test({
  name: "Derive JSONLd example",
  fn: () => {
    const { id, context } = getDerivedValue<JSONLd>(Person);
    assertEquals(id, "Person");
    assertEquals(context, "https://schema.org/");
  },
});
