# ts-derive

[![JSR](https://jsr.io/badges/@fartlabs/derive)](https://jsr.io/@fartlabs/derive)
[![JSR score](https://jsr.io/badges/@fartlabs/derive/score)](https://jsr.io/@fartlabs/derive/score)
[![GitHub Actions](https://github.com/FartLabs/ts-derive/actions/workflows/publish.yaml/badge.svg)](https://github.com/FartLabs/ts-derive/actions/workflows/publish.yaml)

The "Derive" pattern with TypeScript decorators.

## Overview

`ts-derive` is a TypeScript library inspired by Rust's powerful `derive`
attribute. Just as Rust's `derive` allows you to automatically implement traits
for your types based on simple annotations, `ts-derive` enables you to attach
semantic metadata to your TypeScript classes and their members using decorators,
promoting a clean, declarative programming style.

The primary goal of `ts-derive` is to shift the focus from manually implementing
boilerplate logic to declaring _what_ your code represents and _what
capabilities it should have_. By leveraging these declarations (applied via
decorators), the library can automate the generation of significant portions of
your application's components, reducing manual coding effort and potential
errors.

A key capability enabled by `ts-derive` is the ability to use your source code
itself as a rich knowledge base. Through code introspection and the metadata
provided by decorators, `ts-derive` can extract structured information. This
knowledge can be represented and processed, potentially enabling advanced use
cases such as:

- **Automated Code Generation:** Generating serialization/deserialization logic,
  API endpoints, documentation, configuration files, etc., based on class
  structure and decorators.
- **Knowledge Representation:** Representing code structure and relationships as
  structured data, potentially in formats like triples (subject, predicate,
  object).
- **Rule-Based Reasoning:** Inferring implicit knowledge or verifying
  constraints based on the declared metadata.
- **Linked Data Applications:** Utilizing the extracted and structured
  knowledge, potentially accessible via protocols like SPARQL, to build
  sophisticated linked data applications, as discussed in areas like "Thinking
  with Knowledge Graphs: Enhancing LLM Reasoning Through Structured Data."

By providing an abstraction layer for annotations and powerful introspection
capabilities, `ts-derive` empowers developers to precisely build robust,
predictable programs with substantially decreased manual effort and maintenance
costs.

## Example

The following example illustrates how to derive the TypeScript class declaration
of a class using `ts-morph`.

```ts
import { assertEquals } from "@std/assert/equals";
import { createDerive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import { ClassDeclaration } from "./typescript.ts";

const derive = createDerive([FilePath.from(import.meta)]);

@derive(await ClassDeclaration.auto())
class Person {}

Deno.test({
  name: "Derive TypeScriptClassDeclaration example (auto)",
  fn: () => {
    const actual = getDerivedValue<ClassDeclaration>(Person);
    assertEquals(actual.classDeclaration.name, "Person");
  },
});
```

## Develop

Run unit tests.

```sh
deno task test
```

Format code.

```sh
deno fmt
```

Lint code.

```sh
deno lint
```

---

Developed with 💖 [**@FartLabs**](https://github.com/FartLabs)
