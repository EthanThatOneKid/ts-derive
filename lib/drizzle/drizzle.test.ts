import { assert } from "@std/assert/assert";
import * as sqlite from "drizzle-orm/sqlite-core";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { TypeScriptClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "../json-schema/json-schema.ts";
import { DrizzleTable } from "./drizzle.ts";

const Derive = createDerive([
  FilePath.from(import.meta),
  await TypeScriptClassDeclaration.auto(),
  JSONSchema.auto(),
]);

@Derive(
  new DrizzleTable(
    sqlite.sqliteTable("person", {
      familyName: sqlite.text(),
      givenName: sqlite.text().notNull(),
    }),
  ),
)
class Person {
  public familyName?: string;

  public constructor(public givenName: string) {}
}

Deno.test("Derive DrizzleTable example", () => {
  const actual = getDerivedValue<DrizzleTable>(Person).drizzleTable;
  assert(actual !== undefined);
});
