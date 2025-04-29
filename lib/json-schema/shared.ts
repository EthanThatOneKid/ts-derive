import type { Compile } from "@sinclair/typemap";

/**
 * JSONSchemaObject is the JSONSchema representation of a class.
 */
// deno-lint-ignore no-explicit-any
export type JSONSchemaObject = ReturnType<typeof Compile<any>>;
