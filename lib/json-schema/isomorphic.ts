import type { JSONSchemaObject } from "./json-schema.ts";
import { default as jsonSchemaDiff } from "json-schema-diff";

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
