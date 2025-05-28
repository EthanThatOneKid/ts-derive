import * as sqlite from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-typebox";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "./json-schema.ts";
import { assertIsomorphic } from "./isomorphic.ts";

const derive = createDerive([
  FilePath.from(import.meta),
  await ClassDeclaration.auto(),
  JSONSchema.auto(),
]);

@derive({
  sqliteTable: sqlite.sqliteTable("person", {
    givenName: sqlite.text("given_name").notNull(),
    familyName: sqlite.text("family_name"),
  }),
})
class Person {
  public constructor(
    public givenName: string,
    public familyName: string | null,
  ) {}
}

Deno.test({
  name: "Derive Drizzle isomorphic example",
  fn: async () => {
    const autoSchema = getDerivedValue<JSONSchema>(Person).jsonSchema;
    const personTable = getDerivedValue<{ sqliteTable: sqlite.SQLiteTable }>(
      Person,
    ).sqliteTable;
    const sqliteSchema = createSelectSchema(personTable);
    await assertIsomorphic(autoSchema, sqliteSchema);
  },
});
