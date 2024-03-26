import { Pool, PoolOptions } from "mysql2";
import { PoolConfig } from "pg";

import { createMySQLDBSimple as createMySQLDB} from "@/db/mysql/mysql.db";
import { createSQLiteDBSimple as createSQLiteDB } from "@/db/sqlite/sqlite.db";
import { createPostgresDBSimple as createPostgresDB } from "@/db/postgres/postgres.db";
import { createPostgresDBSimple as createVercelPostgresDB } from "@/db/postgres-vercel/postgres.db";

import { up as upSqlite } from "@/db/sqlite/sqlite.migration";
import { up as upMysql } from "@/db/mysql/mysql.migration";
import { up as upVercelPostgres } from "@/db/postgres-vercel/postgres.migration";
import { up as upPostgres } from "@/db/postgres/postgres.migration";
import { DBInterface } from "@/db/interface";

const envName = "DATABASE";
async function SetUp() {
  async function setupVercelPostGres() {
    const db = createVercelPostgresDB();
    await upVercelPostgres(db.adapter());
    return db;
  }

  async function setUpPostgres(args: PoolConfig) {
    const db = createPostgresDB(args);
    await upPostgres(db.adapter());
    return db;
  }

  async function setupSqlite() {
    const db = createSQLiteDB("sqlite.db");
    await upSqlite(db.adapter());
    return db;
  }

  async function setupMySQL(args: PoolOptions) {
    const db = createMySQLDB(args);
    await upSqlite(db.adapter());
    return db;
  }

  let db: DBInterface | undefined = undefined;

  const dbName = process.env[envName];

  switch (dbName) {
    case "sqlite":
      db = await setupSqlite();
      break;
    case "postgres-vercel":
      db = await setupVercelPostGres();
      break;
    case "postgres":
      db = await setUpPostgres({
        password:"mysecretpassword",
        user:"main"
      })
      break
    case "planetscale":
      //TODO
      throw Error("planetscale is not yet implemented");
  }

  if (db === undefined) {
    throw Error(`
    environment variable ${envName} is not set to a valid string.
    Options are ${["sqlite", "postgres-vercel","postgres", "planetscale"].join(",")}.`);
  }

  return db;
}

const promiseDB = SetUp();

export { promiseDB };
