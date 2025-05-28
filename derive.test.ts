import { assertEquals } from "@std/assert/equals";
import { derive, getDerivedValue } from "./derive.ts";

class Context {
  public constructor(public context: string | Record<string, unknown>) {}
}

Deno.test("Derive decorator example", () => {
  @derive(() => new Context("https://schema.org/"))
  class Person {}

  const actual = getDerivedValue<Context>(Person).context;
  assertEquals(actual, "https://schema.org/");
});
