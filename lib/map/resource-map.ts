/**
 * ResourceMap is a Map that has a primary key.
 */
export class ResourceMap<
  TKey,
  TValue extends Record<TPrimaryKey, TKey>,
  TPrimaryKey extends PropertyKey,
> extends Map<TKey, TValue> {
  /**
   * constructor is the constructor of the ResourceMap class.
   */
  public constructor(
    public primaryKey: TPrimaryKey,
    data?: Iterable<readonly [TKey, TValue]>,
  ) {
    super(data);
  }

  /**
   * setResource sets a resource in the map.
   */
  public setResource(value: TValue): this {
    return super.set(value[this.primaryKey], value);
  }

  /**
   * primaryKey creates a ResourceMap with a primary key.
   */
  public static primaryKey<
    TKey,
    TValue extends Record<TPrimaryKey, TKey>,
    TPrimaryKey extends PropertyKey,
  >(primaryKey: TPrimaryKey): ResourceMap<TKey, TValue, TPrimaryKey> {
    return new ResourceMap(primaryKey);
  }
}
