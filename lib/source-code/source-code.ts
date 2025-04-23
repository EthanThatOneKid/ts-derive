/**
 * SourceCode is the container for the source code of a class.
 */
export class SourceCode {
  /**
   * constructor is the constructor of the SourceCode class.
   */
  public constructor(
    /**
     * sourceCode is the source code of a class.
     */
    public sourceCode: string,
  ) {}

  /**
   * readTextFile is a static method that reads the source code of a class.
   */
  public static async readTextFile(
    path: string | URL,
    options?: Deno.ReadFileOptions,
  ): Promise<SourceCode> {
    return new SourceCode(await Deno.readTextFile(path, options));
  }

  /**
   * readTextFileSync is a static method that reads the source code of a class.
   */
  public static readTextFileSync(path: string | URL): SourceCode {
    return new SourceCode(Deno.readTextFileSync(path));
  }
}
