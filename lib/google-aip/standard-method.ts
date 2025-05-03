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
  /**
   * store contains the options for the persistent store.
   */
  store: {
    /**
     * kv is the persistent store.
     */
    kv: Deno.Kv;

    /**
     * kvKey returns the key to use by session ID and resource ID.
     */
    kvKey: (
      id: string,
      sessionID?: string | undefined,
    ) => Deno.KvKey | Promise<Deno.KvKey>;

    /**
     * kvKeyOf calculates the key to use for the resource.
     */
    kvKeyOf: (
      // deno-lint-ignore no-explicit-any
      resource?: any,
      sessionID?: string | undefined,
    ) => Deno.KvKey | Promise<Deno.KvKey>;

    /**
     * expireIn is the expiration time in milliseconds on the persistent store.
     */
    expireIn?: number;
    // TODO: Refactor kvKey to support multiple IDs (parent path parameters).
  };

  /**
   * oAuth2 is the OAuth 2.0 authentication strategy.
   *
   * @see https://jsr.io/@deno/kv-oauth
   */
  oAuth2?: {
    /**
     * getSessionID returns the session ID.
     */
    getSessionID: (
      request: Request,
    ) => string | undefined | Promise<string | undefined>;
  };

  resourceName?: string;
  collectionIdentifier?: string;
  parent?: string;

  // TODO: Add input and output strategies e.g. request body and URL search params.
  // TODO: Add validation strategies e.g. standardschema.dev, Ajv, Zod, etc.
  // TODO: Add persistent store strategies e.g. Deno.Kv, N3, LibSQL, etc.
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
  standardMethod: StandardMethod,
): Route {
  const resourceName = options.resourceName ?? target.name;
  const method = toHTTPMethod(standardMethod);
  const pattern = toRoutePattern(
    standardMethod,
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
      const sessionID = await options.oAuth2?.getSessionID(request);
      if (sessionID === undefined && options.oAuth2 !== undefined) {
        return new Response("Unauthorized", { status: 401 });
      }

      const id = params?.pathname.groups?.[toCamelCase(resourceName)];
      switch (standardMethod) {
        // https://google.aip.dev/131
        case "get": {
          if (id === undefined) {
            return new Response("No ID", { status: 400 });
          }

          const kvKey = await options.store.kvKey(
            decodeURIComponent(id),
            sessionID,
          );
          const result = await options.store.kv.get(kvKey);
          if (result.value === null) {
            return new Response("Not found", { status: 404 });
          }

          return new Response(JSON.stringify(result.value), { status: 200 });
        }

        // https://google.aip.dev/132
        case "list": {
          // https://google.aip.dev/client-libraries/4233
          throw new Error("Not implemented");
        }

        // https://google.aip.dev/133
        case "create": {
          // deno-lint-ignore no-explicit-any
          const validated: any = await standardSchema.validate(
            await request.json(),
          );
          if (validated.issues !== undefined) {
            return new Response(JSON.stringify(validated), { status: 400 });
          }

          const kvKey = await options.store.kvKeyOf(validated.value, sessionID);
          const result = await options.store.kv.set(kvKey, validated.value, {
            expireIn: options.store.expireIn,
          });
          if (!result.ok) {
            return new Response(JSON.stringify(result), { status: 500 });
          }

          return new Response(JSON.stringify(validated.value), { status: 201 });
        }

        // https://google.aip.dev/134
        case "update": {
          throw new Error("Not implemented");
        }

        // https://google.aip.dev/135
        case "delete": {
          if (id === undefined) {
            return new Response("No ID", { status: 400 });
          }

          const kvKey = await options.store.kvKey(
            decodeURIComponent(id),
            sessionID,
          );
          await options.store.kv.delete(kvKey);
          return new Response(null, { status: 204 });
        }

        default: {
          return new Response("Method not allowed", { status: 405 });
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
      return "GET";
    }

    case "create":
    case "update": {
      return "POST";
    }

    case "delete": {
      return "DELETE";
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
