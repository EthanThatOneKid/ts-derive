// deno-lint-ignore-file no-explicit-any

/**
 * Class is a runtime class.
 */
export type Class = new (...args: any[]) => any;

/**
 * Derive is a decorator that derives a value from a class.
 */
export const Derive = createDerive(getDerivedValue, setDerivedValue, {});

/**
 * createDerive creates a Derive decorator.
 */
export function createDerive(
  get: <TInput>(target: Class) => TInput,
  set: <TOutput>(target: Class, value: TOutput) => void,
  initialValue: any,
) {
  return <TOutput, TInput = never>(
    ...fns: Array<(input: TInput) => TOutput>
  ) => {
    return (target: Class): Class => {
      const value = get(target) ?? initialValue;
      for (const fn of fns) {
        Object.assign(value, fn(value));
      }

      set(target, value);
      return target;
    };
  };
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
