// deno-lint-ignore-file no-explicit-any

/**
 * Class is a runtime class.
 */
export type Class = new (...args: any[]) => any;

/**
 * Derive is a decorator that derives a value from a class.
 */
export const Derive = createDerive(getDerivedValue, setDerivedValue);

/**
 * createDerive creates a Derive decorator.
 */
export function createDerive(
  get: Parameters<typeof derive>[2],
  set: Parameters<typeof derive>[3],
  initialValue?: Parameters<typeof derive>[4],
) {
  return <TInput, TOutput>(
    ...fns: Array<TOutput | ((input: TInput) => TOutput)>
  ) => {
    return (target: Class) => {
      return derive(target, fns, get, set, initialValue);
    };
  };
}

/**
 * derive performs the derive operation.
 */
export function derive<TInput, TOutput>(
  target: Class,
  fns: Array<TOutput | ((input: TInput) => TOutput)>,
  get: <TInput>(target: Class) => TInput,
  set: <TOutput>(target: Class, value: TOutput) => void,
  initialValue: (target: Class) => Record<PropertyKey, unknown> = (target) => ({
    name: target.name,
  }),
) {
  const value: any = get(target) ?? initialValue(target);
  for (const fnOrValue of fns) {
    Object.assign(
      value,
      typeof fnOrValue === "function"
        ? (fnOrValue as (input: TInput) => TOutput)(value)
        : fnOrValue,
    );
  }

  set(target, value);
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
