import type {
  ClassDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
} from "ts-morph";
import { Project, StructureKind } from "ts-morph";

/**
 * serialize serializes the class declaration into an interface string.
 */
export function serialize(classDeclaration: ClassDeclarationStructure): string {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("");
  const interfaceDeclaration = sourceFile.addInterface(
    getInterfaceDeclaration(classDeclaration),
  );

  return `{ ${interfaceDeclaration.getChildSyntaxListOrThrow().getText()} }`;
}

/**
 * getInterfaceDeclaration gets the interface declaration from the class declaration.
 */
function getInterfaceDeclaration({
  extends: _extends,
  methods: _methods,
  ...classDeclaration
}: ClassDeclarationStructure): OptionalKind<InterfaceDeclarationStructure> {
  if (!classDeclaration.name) {
    throw new Error("ClassDeclaration must have a name.");
  }

  return {
    ...classDeclaration,
    name: classDeclaration.name,
    properties: getProperties(classDeclaration),
    kind: StructureKind.Interface,
  };
}

// TODO: Get properties with TypeScript type checker to infer the property types.
function getProperties(
  classDeclaration: ClassDeclarationStructure,
): OptionalKind<PropertySignatureStructure>[] {
  return [
    ...(classDeclaration.properties?.map(
      ({
        scope: _scope,
        ...property
      }): OptionalKind<PropertySignatureStructure> => {
        return { ...property, kind: StructureKind.PropertySignature };
      },
    ) ?? []),
    ...(classDeclaration.ctors
      ?.at(-1)
      ?.parameters?.filter((parameter) => parameter.scope === "public")
      ?.map(
        ({
          scope: _scope,
          ...parameter
        }): OptionalKind<PropertySignatureStructure> => {
          return { ...parameter, kind: StructureKind.PropertySignature };
        },
      ) ?? []),
  ];
}
