import type { Route } from "@std/http/unstable-route";
import { slugify } from "@std/text/unstable-slugify";
import { toCamelCase } from "@std/text/to-camel-case";
import pluralize from "@wei/pluralize";
import type { Class } from "../../derive.ts";
import { getDerivedValue } from "../../derive.ts";
import type { ZodSchema } from "../json-schema/zod-schema.ts";

/**
 * StandardMethodRouteOptions are options for standardMethodRoute.
 */
export interface StandardMethodRouteOptions {
  standardMethod: StandardMethod;
  kv: Deno.Kv;
  resourceName?: string;
  collectionIdentifier?: string;
  parent?: string;

  // TODO: Add input and output strategies e.g. request body and URL search params.
  // TODO: Add validation strategies e.g. standardschema.dev, Ajv, Zod, etc.
}

/**
 * standardMethodRoute returns a route for a standard method.
 */
export function standardMethodRoute(
  target: Class,
  options: StandardMethodRouteOptions,
): Route {
  console.log(target, options);
  const resourceName = options.resourceName ?? target.name;
  const method = toHTTPMethod(options.standardMethod);
  const pattern = toRoutePattern(
    options.standardMethod,
    resourceName,
    options.collectionIdentifier,
    options.parent,
  );

  const { zodObject } = getDerivedValue<ZodSchema>(target);
  return {
    pattern,
    method,
    handler: async (request, _params, _info) => {
      // const param = params?.pathname.groups?.[toCamelCase(resourceName)];
      switch (options.standardMethod) {
        case "create": {
          const body = await request.json();
          const validation = zodObject.safeParse(body);
          console.log({ validation });
          return new Response("Method not implemented", { status: 501 });
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
