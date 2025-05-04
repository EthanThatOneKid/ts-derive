import type { ClassDeclarationStructure, Project } from "ts-morph";
import type { FilePath } from "../file-path/file-path.ts";

/**
 * TypeScriptClassDeclaration is the container for the TypeScript declaration
 * of a class using `ts-morph`.
 */
export class TypeScriptClassDeclaration {
  /**
   * constructor is the constructor of the TypeScriptClassDeclaration class.
   */
  public constructor(public classDeclaration: ClassDeclarationStructure) {}

  /**
   * auto is a static method implicitly returns a TypeScriptClassDeclaration by
   * its file specifier and identifier.
   */
  // deno-lint-ignore no-explicit-any
  public static async auto(): Promise<any> {
    const { project } = await import("./auto.ts");
    return TypeScriptClassDeclaration.getOrThrow(project);
  }

  /**
   * getOrThrow is a static method that returns a TypeScriptClassDeclaration
   * by its file specifier and identifier.
   */
  // deno-lint-ignore no-explicit-any
  public static getOrThrow(project: Project): any {
    return ({ name, filePath }: { name: string } & FilePath) => {
      return new TypeScriptClassDeclaration(
        getClassStructureOrThrow(project, filePath, name),
      );
    };
  }
}

function getClassStructureOrThrow(
  project: Project,
  filePath: string,
  name: string,
): ClassDeclarationStructure {
  // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
  const sourceFile = project.getSourceFileOrThrow(filePath);
  const classDeclaration = sourceFile.getClassOrThrow(name);
  return classDeclaration.getStructure();
}
