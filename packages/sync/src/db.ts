import initSqlJs, { Database } from "sql.js";
// @ts-ignore
import sqliteUrl from "../assets/sql-wasm.wasm?url";

interface IDatabase {
  open(): Promise<void>;
  execute(sql: string): Promise<void>;
  migrate(sql: string): Promise<void>;
}

const DATABASE_VERSION = "0.0.1";
const DATABASE_NAME = `sync_v${DATABASE_VERSION}.db`;

class RenderThreadSQLite implements IDatabase {
  private db: Database;

  async open() {
    const sql = await initSqlJs({
      
      locateFile: (file) => {
        return sqliteUrl;
      },
    });

    this.db = new sql.Database();
  }

  async execute(sql: string) {
}

