import { assertEquals } from "@std/assert";
import { Derive } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { StandardSchema } from "../standard-schema/standard-schema.ts";
import { standardMethodRoute } from "./standard-method.ts";

@Derive(StandardSchema.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public constructor(public givenName: string) {}
}

function personKvKey(id: string) {
  return ["person", id];
}

function personKvKeyOf(resource: Person) {
  return ["person", resource?.givenName];
}

Deno.test({
  name: "Google AIP Standard Methods example",
  fn: async (t) => {
    await using kv = await Deno.openKv(":memory:");

    const ash = new Person("Ash");

    await t.step(
      "Standard method Create handler handles valid request",
      async () => {
        const request = new Request("http://localhost", {
          method: "POST",
          body: JSON.stringify(ash),
        });

        const createRoute = standardMethodRoute(Person, {
          standardMethod: "create",
          resourceName: "person",
          store: { kv, kvKey: personKvKey, kvKeyOf: personKvKeyOf },
        });
        const response = await createRoute.handler(request);
        assertEquals(response.status, 201);

        const createResponse = await response.json();
        assertEquals(createResponse.givenName, ash.givenName);
      },
    );
  },
});
