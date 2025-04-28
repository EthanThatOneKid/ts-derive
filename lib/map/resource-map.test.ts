import { assertEquals } from "@std/assert/equals";
import { Derive, getDerivedValue } from "../../derive.ts";
import { ResourceMap } from "./resource-map.ts";

interface Store {
  store: ResourceMap<string, Person, "givenName">;
}

@Derive(() => ({ store: ResourceMap.primaryKey("givenName") }))
class Person {
  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive ResourceMap example",
  fn: () => {
    const { store } = getDerivedValue<Store>(Person);
    const person = new Person("Ash");
    store.setResource(person);

    const actual = store.get(person.givenName);
    assertEquals(actual, person);
  },
});
