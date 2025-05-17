import type { Table } from "drizzle-orm";

export type { Table };

/**
 * DrizzleTable is the Drizzle schema representation of a class.
 */
export class DrizzleTable {
  /**
   * constructor is the constructor of the SourceCode class.
   */
  public constructor(
    /**
     * drizzleTable is the Drizzle schema of a class.
     */
    public drizzleTable: Table,
  ) {}
}
