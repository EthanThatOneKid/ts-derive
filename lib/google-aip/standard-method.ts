import type { Route } from "@std/http/unstable-route";
import { slugify } from "@std/text/unstable-slugify";
import { toCamelCase } from "@std/text/to-camel-case";
import pluralize from "@wei/pluralize";
import type { Class } from "../../derive.ts";
import { getDerivedValue } from "../../derive.ts";
import type { StandardSchema } from "../standard-schema/standard-schema.ts";

/**
 * StandardMethodRouteOptions are options for standardMethodRoute.
 */
export interface StandardMethodRouteOptions {
  standardMethod: StandardMethod;
  store: {
    /**
     * kv is the persistent store.
     */
    kv: Deno.Kv;

    /**
     * kvKey returns the key to use by ID.
     */
    kvKey: (id: string) => Deno.KvKey | Promise<Deno.KvKey>;

    /**
     * kvKeyOf calculates the key to use for the resource.
     */
    // deno-lint-ignore no-explicit-any
    kvKeyOf: (resource: any) => Deno.KvKey | Promise<Deno.KvKey>;
    // TODO: Refactor kvKey to support multiple IDs (path parameters).
  };

  resourceName?: string;
  collectionIdentifier?: string;
  parent?: string;

  // TODO: Add input and output strategies e.g. request body and URL search params.
  // TODO: Add validation strategies e.g. standardschema.dev, Ajv, Zod, etc.
  // TODO: Add persistent store strategies e.g. Deno.Kv, N3, LibSQL, etc.
  // TODO: Add authorization strategies e.g. deno_kv_oauth, etc.
  // TODO: Add custom middleware e.g. cors, etc.
}

/**
 * standardMethodRoute returns a route for a Google AIP standard method.
 *
 * @see https://google.aip.dev/130
 */
export function standardMethodRoute(
  target: Class,
  options: StandardMethodRouteOptions,
): Route {
  const resourceName = options.resourceName ?? target.name;
  const method = toHTTPMethod(options.standardMethod);
  const pattern = toRoutePattern(
    options.standardMethod,
    resourceName,
    options.collectionIdentifier,
    options.parent,
  );

  const standardSchema =
    getDerivedValue<StandardSchema>(target).standardSchemaV1["~standard"];
  return {
    pattern,
    method,
    handler: async (request, params, _info) => {
      const id = params?.pathname.groups?.[toCamelCase(resourceName)];
      switch (options.standardMethod) {
        case "create": {
          // https://google.aip.dev/133
          // deno-lint-ignore no-explicit-any
          const validated: any = await standardSchema.validate(
            await request.json(),
          );
          if (validated.issues !== undefined) {
            return new Response(JSON.stringify(validated), { status: 400 });
          }

          const kvKey = await options.store.kvKeyOf(validated.value);
          const result = await options.store.kv.set(kvKey, validated.value);
          if (!result.ok) {
            return new Response(JSON.stringify(result), { status: 500 });
          }

          return new Response(JSON.stringify(validated.value), { status: 201 });
        }

        // TODO: Write unit test.
        case "get": {
          // https://google.aip.dev/133
          if (id === undefined) {
            return new Response("No ID", { status: 400 });
          }

          const kvKey = await options.store.kvKey(id);
          const result = await options.store.kv.get(kvKey);
          if (!result) {
            return new Response("Not found", { status: 404 });
          }

          return new Response(JSON.stringify(result), { status: 200 });
        }

        default: {
          return new Response("Method not implemented", { status: 501 });
        }
      }
    },
  };
}

/**
 * toRoutePattern returns the URPattern of a route.
 */
export function toRoutePattern(
  standardMethod: StandardMethod,
  resourceName: string,
  collectionIdentifier?: string,
  parent?: string,
): URLPattern {
  switch (standardMethod) {
    case "create":
    case "list": {
      return new URLPattern({
        pathname: toRoutePath(resourceName, collectionIdentifier, parent),
      });
    }

    case "get":
    case "update":
    case "delete": {
      return new URLPattern({
        pathname: `${
          toRoutePath(
            resourceName,
            collectionIdentifier,
            parent,
          )
        }/:${toCamelCase(resourceName)}`,
      });
    }

    default: {
      throw new Error(`Unknown standard method ${standardMethod}`);
    }
  }
}

/**
 * toRoutePath returns the path of a route.
 */
export function toRoutePath(
  resourceName: string,
  collectionIdentifier?: string,
  parent?: string,
): string {
  return `${parent ?? ""}/${
    collectionIdentifier ?? toCollectionIdentifier(resourceName)
  }`;
}

/**
 * toCollectionIdentifier converts a resource name to a collection identifier.
 *
 * @see https://google.aip.dev/122#collection-identifiers
 */
export function toCollectionIdentifier(name: string): string {
  return pluralize(slugify(name));
}

/**
 * toHTTPMethod converts a standard method to an HTTP method.
 */
export function toHTTPMethod(method: StandardMethod): string {
  switch (method) {
    case "get":
    case "list": {
      return "get";
    }

    case "create":
    case "update": {
      return "post";
    }

    case "delete": {
      return "delete";
    }

    default:
      throw new Error(`Unknown standard method ${method}`);
  }
}

export type StandardMethod = (typeof standardMethods)[number];

export const standardMethods = [
  "get",
  "create",
  "update",
  "delete",
  "list",
] as const;
