import type { ClassDeclarationStructure, Project } from "ts-morph";
import type { FilePath } from "../file-path/file-path.ts";

/**
 * ClassDeclaration is the container for the TypeScript declaration
 * of a class using `ts-morph`.
 */
export class ClassDeclaration {
  /**
   * constructor is the constructor of the ClassDeclaration class.
   */
  public constructor(public classDeclaration: ClassDeclarationStructure) {}

  /**
   * auto is a static method implicitly returns a ClassDeclaration by
   * its file specifier and identifier.
   */
  // deno-lint-ignore no-explicit-any
  public static async auto(): Promise<any> {
    const { project } = await import("./auto.ts");
    return ClassDeclaration.getOrThrow(project);
  }

  /**
   * getOrThrow is a static method that returns a ClassDeclaration
   * by its file specifier and identifier.
   */
  // deno-lint-ignore no-explicit-any
  public static getOrThrow(project: Project): any {
    return ({ name, filePath }: { name: string } & FilePath) => {
      return new ClassDeclaration(
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
