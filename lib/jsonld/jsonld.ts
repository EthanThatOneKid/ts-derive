/**
 * JSONLd is the JSONLd data of a class.
 *
 * @see https://json-ld.org/
 */
export class JSONLd {
  /**
   * constructor is the constructor of the JSONLd class.
   */
  public constructor(
    /**
     * id is the JSONLd id of a class.
     */
    public id: string,
    /**
     * context is the JSONLd context of a class.
     */
    public context: Context,
  ) {}

  /**
   * context is a static method that returns a JSONLd by its context and
   * implicit ID.
   */
  public static context(context: Context): (value: { name: string }) => JSONLd {
    return ({ name }: { name: string }) => new JSONLd(name, context);
  }
}

/**
 * Context is the JSONLd context of a class.
 */
export type Context =
  | string
  | Record<string, unknown>
  | Array<string | Record<string, unknown>>;
