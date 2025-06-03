import * as sqlite from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-typebox";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "../typescript/typescript.ts";
import { JSONSchema } from "./json-schema.ts";
import { assertIsomorphic } from "./isomorphic.ts";

const filePath = FilePath.fromMeta(import.meta);
const classDeclaration = await ClassDeclaration.auto();
const jsonSchema = JSONSchema.auto();

@derive(filePath, classDeclaration, jsonSchema, {
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
