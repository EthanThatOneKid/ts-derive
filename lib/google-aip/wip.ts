import { Derive } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { ZodSchema } from "../json-schema/zod-schema.ts";
import { standardMethodRoute } from "./standard-method.ts";

await using kv = await Deno.openKv(":memory:");

@Derive(ZodSchema.auto())
@Derive(JSONSchema.auto())
@Derive(await TypeScriptClassDeclaration.auto())
@Derive(FilePath.from(import.meta))
class Person {
  public constructor(public givenName: string) {}
}

// deno -A --unstable-kv lib/google-aip/wip.ts
if (import.meta.main) {
  console.log(Person);

  const dude = new Person("The Big Lebowski");
  console.log({ dude });

  const route = standardMethodRoute(
    Person,
    { kv, standardMethod: "create" },
  );
  const response = await route.handler(new Request("http://localhost"));
  console.log({ response });
}
