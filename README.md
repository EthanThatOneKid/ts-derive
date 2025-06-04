# ts-derive

[![JSR](https://jsr.io/badges/@fartlabs/derive)](https://jsr.io/@fartlabs/derive)
[![JSR score](https://jsr.io/badges/@fartlabs/derive/score)](https://jsr.io/@fartlabs/derive/score)
[![GitHub Actions](https://github.com/FartLabs/ts-derive/actions/workflows/publish.yaml/badge.svg)](https://github.com/FartLabs/ts-derive/actions/workflows/publish.yaml)

The "Derive" pattern with TypeScript decorators.

## Overview

`ts-derive` is a TypeScript library inspired by Rust's powerful
[`derive` attribute](https://doc.rust-lang.org/reference/attributes/derive.html).
Just as Rust's `derive` allows developers to automatically implement traits for
their types based on simple annotations, `ts-derive` enables developers to
implement interfaces for their TypeScript classes based on simple annotations.

The primary goal of `ts-derive` is to shift the focus from manually implementing
boilerplate logic to declaring _what_ the code represents and _what capabilities
it should have_. By leveraging these declarations (applied via decorators), the
library can automate the generation of significant portions of the application's
components, reducing manual coding effort and potential errors.

A key capability enabled by `ts-derive` is the ability to use the source code
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

By providing an abstraction layer for annotations and powerful introspection
capabilities, `ts-derive` empowers developers to precisely build robust,
predictable programs with substantially decreased manual effort and maintenance
costs.

## Example

The following [example](./lib/typescript/auto.test.ts) illustrates how to derive
the TypeScript class declaration of a class using `ts-morph`.

```ts
import { assertEquals } from "@std/assert/equals";
import { derive, getDerivedValue } from "../../derive.ts";
import { FilePath } from "../file-path/file-path.ts";
import type { ClassDeclaration } from "./typescript.ts";
import { classDeclaration } from "./auto.ts";

const filePath = FilePath.fromMeta(import.meta);

@derive(filePath, classDeclaration)
class Person {}

Deno.test({
  name: "Derive ClassDeclaration example (auto)",
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
