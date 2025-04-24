import type { ClassDeclarationStructure, Project } from "ts-morph";

/**
 * TypeScriptClassDeclaration is the container for the TypeScript declaration of a class.
 */
export class TypeScriptClassDeclaration {
  /**
   * constructor is the constructor of the TypeScriptClassDeclaration class.
   */
  public constructor(
    // TODO: Expose type info.
    public declaration: ClassDeclarationStructure,
  ) {}

  /**
   * autoGetOrThrow is a static method that returns a TypeScriptClassDeclaration
   * by its file specifier and identifier.
   */
  public static async autoGetOrThrow(
    filePath: string,
    name: string,
  ): Promise<TypeScriptClassDeclaration> {
    const { project } = await import("./auto.ts");
    return TypeScriptClassDeclaration.getOrThrow(project, filePath, name);
  }

  /**
   * getOrThrow is a static method that returns a TypeScriptClassDeclaration
   * by its file specifier and identifier.
   */
  public static getOrThrow(
    project: Project,
    filePath: string,
    name: string,
  ): TypeScriptClassDeclaration {
    // https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API#using-the-type-checker
    const sourceFile = project.getSourceFileOrThrow(filePath);
    const classDeclaration = sourceFile.getClassOrThrow(name);
    return new TypeScriptClassDeclaration(classDeclaration.getStructure());
  }
}
