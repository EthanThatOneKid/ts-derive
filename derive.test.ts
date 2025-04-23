import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "./derive.ts";

class Context {
  public constructor(public context: string | Record<string, unknown>) {}
}

Deno.test("Derive decorator example", () => {
  @Derive(() => new Context("https://schema.org/"))
  class Person {}

  const actual = getDerivedValue<Context>(Person).context;
  assertEquals(actual, "https://schema.org/");
});
