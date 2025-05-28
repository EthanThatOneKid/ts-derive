// deno-lint-ignore-file no-explicit-any

/**
 * Class is a runtime class.
 */
export type Class = new (...args: any[]) => any;

/**
 * DeriveDecorator is a decorator that derives a value from a class.
 */
export interface DeriveDecorator {
  <TInput, TOutput>(...items: DeriveItems<TInput, TOutput>[]): (
    target: Class,
  ) => Class;
}

/**
 * DeriveItems is a list of derived values or functions to derive a value.
 */
export type DeriveItems<TInput, TOutput> =
  | DeriveItem<TInput, TOutput>
  | DeriveItems<TInput, TOutput>[];

/**
 * DeriveItem is a derived value or function to derive a value.
 */
export type DeriveItem<TInput, TOutput> =
  | TOutput
  | ((input: TInput) => TOutput);

/**
 * derive is a decorator that derives a value from a class.
 */
export const derive: DeriveDecorator = createDerive();

/**
 * createDerive creates a Derive decorator.
 */
export function createDerive(
  initialItems: DeriveItems<any, any>[] = [],
  initialValue?: (target: Class) => any,
  get: <TInput>(target: Class) => TInput = getDerivedValue,
  set: <TOutput>(target: Class, value: TOutput) => void = setDerivedValue,
): DeriveDecorator {
  return <TInput, TOutput>(...items: DeriveItems<TInput, TOutput>[]) => {
    return (target: Class) => {
      return deriveClass(
        target,
        [...initialItems, items],
        initialValue,
        get,
        set,
      );
    };
  };
}

/**
 * derive performs the derive operation.
 */
export function deriveClass<TInput, TOutput>(
  target: Class,
  items: DeriveItems<TInput, TOutput>[],
  initialValue?: (target: Class) => TOutput,
  get?: <TInput>(target: Class) => TInput,
  set?: <TOutput>(target: Class, value: TOutput) => void,
): Class {
  const value: any = get?.(target) ?? {
    name: target.name,
    ...initialValue?.(target),
  };
  for (const fnOrValue of items.flat()) {
    Object.assign(
      value,
      typeof fnOrValue === "function"
        ? (fnOrValue as (input: TInput) => TOutput)(value)
        : fnOrValue,
    );
  }

  set?.(target, value);
  return target;
}

/**
 * getDerivedValue gets the derived value of a class on the class prototype.
 */
export function getDerivedValue<T>(target: Class): T {
  return target.prototype["~derive"];
}

/**
 * setDerivedValue sets the derived value of a class on the class prototype.
 */
export function setDerivedValue<T>(target: Class, value: T): void {
  target.prototype["~derive"] = value;
}
