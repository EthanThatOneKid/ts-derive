import { TypeBoxFromSyntax } from "@sinclair/typemap";
import type {
  ClassDeclarationStructure,
  InterfaceDeclarationStructure,
  OptionalKind,
  PropertySignatureStructure,
} from "ts-morph";
import { Project, StructureKind } from "ts-morph";
import type { JSONSchemaObject } from "../json-schema.ts";

/**
 * compile compiles the class declaration into a JSON Schema object.
 */
export function compile(
  classDeclaration: ClassDeclarationStructure,
): JSONSchemaObject {
  return TypeBoxFromSyntax({}, serialize(classDeclaration));
}

/**
 * serialize serializes the class declaration into an interface string.
 */
export function serialize(classDeclaration: ClassDeclarationStructure): string {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("");
  const interfaceDeclaration = sourceFile.addInterface(
    getInterfaceDeclaration(classDeclaration),
  );

  return interfaceDeclaration.getFullText();
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
    throw new Error("TypeScriptClassDeclaration must have a name.");
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
      (property): OptionalKind<PropertySignatureStructure> => {
        return { ...property, kind: StructureKind.PropertySignature };
      },
    ) ?? []),
    ...(classDeclaration.ctors
      ?.at(-1)
      ?.parameters?.filter((parameter) => parameter.scope === "public")
      ?.map((parameter): OptionalKind<PropertySignatureStructure> => {
        return { ...parameter, kind: StructureKind.PropertySignature };
      }) ?? []),
  ];
}
