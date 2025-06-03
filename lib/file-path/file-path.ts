/**
 * FilePath is the container for the file path location of a class.
 */
export class FilePath {
  /**
   * constructor is the constructor of the FilePath class.
   */
  public constructor(
    /**
     * filePath is the location of a class.
     */
    public filePath: string,
  ) {}

  /**
   * fromMeta is a static method that returns the file path location of a
   * class.
   */
  public static fromMeta(meta: ImportMeta): FilePath {
    return new FilePath(meta.url.replace(/^file:\/\/\//, ""));
  }
}
