import { assertEquals } from "@std/assert";
import { route } from "@std/http/unstable-route";
import { Derive } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { StandardSchema } from "../standard-schema/standard-schema.ts";
import type { StandardMethodRouteOptions } from "./standard-method.ts";
import { standardMethodRoute } from "./standard-method.ts";

@Derive(StandardSchema.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public constructor(public givenName: string) {}
}

function personKvKey(id: string, sessionID?: string | undefined) {
  if (sessionID === undefined) {
    throw new Error("Unauthorized");
  }

  return [sessionID, "people", id];
}

function personKvKeyOf(person: Person, sessionID?: string | undefined) {
  if (sessionID === undefined) {
    throw new Error("Unauthorized");
  }

  return [sessionID, "people", person.givenName];
}

const fakeSessionID = "fake-session-id";

Deno.test({
  name: "Google AIP Standard Methods example",
  fn: async (t) => {
    await using kv = await Deno.openKv(":memory:");

    const options: StandardMethodRouteOptions = {
      store: { kv, kvKey: personKvKey, kvKeyOf: personKvKeyOf },
      oAuth2: {
        getSessionID: (request) => {
          return request.headers.get("X-Session-ID") ?? undefined;
        },
      },
    };
    const createRoute = standardMethodRoute(Person, options, "create");
    const getRoute = standardMethodRoute(Person, options, "get");
    const deleteRoute = standardMethodRoute(Person, options, "delete");
    const handler = route(
      [createRoute, getRoute, deleteRoute],
      () => {
        throw new Error("Not implemented");
      },
    );

    const ash = new Person("Ash");

    await t.step(
      "Standard method Create handler handles unauthorized request",
      async () => {
        const request = new Request("http://localhost/people", {
          method: "POST",
          body: JSON.stringify(ash),
        });
        const response = await handler(request);
        assertEquals(response.status, 401);
      },
    );

    await t.step(
      "Standard method Create handler handles valid request",
      async () => {
        const request = new Request("http://localhost/people", {
          method: "POST",
          body: JSON.stringify(ash),
          headers: { "X-Session-ID": fakeSessionID },
        });
        const response = await handler(request);
        assertEquals(response.status, 201);

        const personResponse = await response.json();
        assertEquals(personResponse.givenName, ash.givenName);
      },
    );

    await t.step(
      "Standard method Get handler handles valid request",
      async () => {
        const request = new Request(
          `http://localhost/people/${ash.givenName}`,
          { headers: { "X-Session-ID": fakeSessionID } },
        );
        const response = await handler(request);
        assertEquals(response.status, 200);

        const personResponse = await response.json();
        assertEquals(personResponse.givenName, ash.givenName);
      },
    );

    await t.step(
      "Standard method Delete handler handles valid request",
      async () => {
        const request = new Request(
          `http://localhost/people/${ash.givenName}`,
          { method: "DELETE", headers: { "X-Session-ID": fakeSessionID } },
        );
        const response = await handler(request);
        assertEquals(response.status, 204);
      },
    );
  },
});
