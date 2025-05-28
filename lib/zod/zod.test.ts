import { assert } from "@std/assert/assert";
import { assertEquals } from "@std/assert/equals";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { Zod } from "./zod.ts";

const derive = createDerive([FilePath.from(import.meta)]);

@derive(Zod.auto())
@derive(JSONSchema.auto())
@derive(await ClassDeclaration.auto())
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test({
  name: "Derive Zod example",
  fn: () => {
    const personSchema = getDerivedValue<Zod>(Person).zodObject;
    assert(personSchema.safeParse({ givenName: "Ethan" }).success);
  },
});

@derive(
  Zod.auto((schema) =>
    schema.describe("Entities that have a somewhat fixed, physical extension.")
  ),
)
@derive(JSONSchema.auto())
@derive(await ClassDeclaration.auto())
class Place {
  public constructor(public address: string) {}
}

Deno.test({
  name: "Derive Zod extended example",
  fn: () => {
    const placeSchema = getDerivedValue<Zod>(Place).zodObject;
    const fakePlace = new Place("123 Main St");
    const actualParse = placeSchema.parse<Place>(fakePlace);
    assertEquals(actualParse.address, fakePlace.address);

    const actualSafeParse = placeSchema.safeParse<Place>(fakePlace);
    assert(placeSchema.safeParse<Place>(fakePlace).success);
    assertEquals(actualSafeParse.data?.address, fakePlace.address);
  },
});
