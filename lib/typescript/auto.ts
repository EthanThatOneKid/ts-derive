import { Project } from "ts-morph";
import { ClassDeclaration } from "./typescript.ts";

/**
 * project is the local TypeScript project.
 */
export const project = new Project();
project.addSourceFilesFromTsConfig(
  Deno.env.get("TS_CONFIG_FILE_PATH") ?? "./deno.json",
);

/**
 * classDeclaration is a derive operation that automatically returns
 * a ClassDeclaration by its file specifier and identifier.
 */
// deno-lint-ignore no-explicit-any
export const classDeclaration: any = ClassDeclaration.getOrThrow(project);
