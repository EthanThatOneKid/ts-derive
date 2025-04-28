import type { ClassDeclarationStructure, Project } from "ts-morph";
import type { FilePath } from "../file-path/file-path.ts";

/**
 * TypeScriptClassDeclaration is the container for the TypeScript declaration of a class.
 */
export class TypeScriptClassDeclaration {
  /**
   * constructor is the constructor of the TypeScriptClassDeclaration class.
   */
  public constructor(
    // TODO: Expose type info.
    public classDeclaration: ClassDeclarationStructure,
  ) {}

  /**
   * autoGetOrThrow is a static method that returns a TypeScriptClassDeclaration
   * by its file specifier and identifier.
   */
  public static async autoGetOrThrow(): Promise<
    ({
      name,
      filePath,
    }: { name: string } & FilePath) => TypeScriptClassDeclaration
  > {
    const { project } = await import("./auto.ts");
    return TypeScriptClassDeclaration.getOrThrow(project);
  }

  /**
   * getOrThrow is a static method that returns a TypeScriptClassDeclaration
   * by its file specifier and identifier.
   */
  public static getOrThrow(
    project: Project,
  ): ({
    name,
    filePath,
  }: { name: string } & FilePath) => TypeScriptClassDeclaration {
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
