import { assert } from "@std/assert/assert";
import { default as jsonSchemaDiff } from "json-schema-diff";
import type { JSONSchemaObject } from "./json-schema.ts";

/**
 * isomorphic checks if two JSON Schemas are isomorphic.
 */
export async function isomorphic(
  source: JSONSchemaObject,
  destination: JSONSchemaObject,
): Promise<boolean> {
  const diff = await jsonSchemaDiff.diffSchemas({
    sourceSchema: source,
    destinationSchema: destination,
  });

  return !diff.additionsFound && !diff.removalsFound;
}

/**
 * assertIsomorphic checks if two JSON Schemas are isomorphic.
 *
 * The assertion succeeds if the schemas are isomorphic and fails otherwise.
 */
export async function assertIsomorphic(
  source: JSONSchemaObject,
  destination: JSONSchemaObject,
): Promise<void> {
  assert(await isomorphic(source, destination));
}
