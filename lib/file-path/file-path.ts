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
   * from is a static method that returns the file path location of a class.
   */
  public static from(meta: ImportMeta): FilePath {
    return new FilePath(meta.url.replace(/^file:\/\/\//, ""));
  }
}
