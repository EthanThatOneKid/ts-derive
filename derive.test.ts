import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "./derive.ts";

class Context {
  constructor(public context: string | Record<string, unknown>) {}
}

Deno.test("Derive decorator example", () => {
  @Derive(() => new Context("https://schema.org/"))
  class Person {
    constructor(public givenName: string) {}
  }

  const actual = getDerivedValue<Context>(Person).context;
  assertEquals(actual, "https://schema.org/");
});
