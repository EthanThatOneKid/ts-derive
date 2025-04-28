/**
 * ResourceMap is a Map that has a primary key.
 */
export class ResourceMap<TKey, TValue> extends Map<TKey, TValue> {
  /**
   * constructor is the constructor of the ResourceMap class.
   */
  public constructor(
    public primaryKey: (value: TValue) => TKey,
    data?: Iterable<readonly [TKey, TValue]>,
  ) {
    super(data);
  }

  /**
   * setResource sets a resource in the map.
   */
  public setResource(value: TValue): this {
    return super.set(this.primaryKey(value), value);
  }
}
