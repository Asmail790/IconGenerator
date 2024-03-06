import { Kysely, QueryResult, sql } from "kysely";
import { Schema } from "../schema";

export async function up(db: Kysely<Schema>): Promise<void> {
  const varchar256 = "varchar(256)";
  const showCurrentSelectedDataBaseQuery = (await db.executeQuery(
    sql` SELECT DATABASE()`.compile(db)
  )) as QueryResult<{ "DATABASE()": string }>;
  const item = showCurrentSelectedDataBaseQuery.rows[0];

  if (item === undefined) {
    throw Error("database not selected");
  }
  const dbName = item["DATABASE()"];

  const showDBTablesQuery = await db.executeQuery(
    sql.raw(`show tables from ${dbName}`).compile(db)
  );
  const tablesExistInDB = showDBTablesQuery.rows.length != 0;

  if (tablesExistInDB) {
    return;
  }

  await db.schema
    .createTable("User")
    .addColumn("id", varchar256, (col) =>
      col.primaryKey().defaultTo(sql`(uuid())`)
    )
    .addColumn("name", "text")
    .addColumn("email", varchar256, (col) => col.unique().notNull())
    .addColumn("emailVerified", "text")
    .addColumn("image", "text")
    .execute();

  await db.schema
    .createTable("Account")
    .addColumn("id", varchar256, (col) =>
      col.primaryKey().defaultTo(sql`(uuid())`)
    )
    .addColumn("userId", varchar256, (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .execute();

  await db.schema
    .createTable("Session")
    .addColumn("id", varchar256, (col) =>
      col.primaryKey().defaultTo(sql`(uuid())`)
    )
    .addColumn("userId", varchar256, (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", varchar256, (col) => col.notNull().unique())
    .addColumn("expires", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("VerificationToken")
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", varchar256, (col) => col.notNull().unique())
    .addColumn("expires", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("Account_userId_index")
    .on("Account")
    .column("userId")
    .execute();

  await db.schema
    .createIndex("Session_userId_index")
    .on("Session")
    .column("userId")
    .execute();

  await db.schema
    .createTable("Icon")
    .ifNotExists()
    .addColumn("userId", varchar256, (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("data", "blob", (col) => col.notNull())
    .addColumn("color", "text", (col) => col.notNull())
    .addColumn("style", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("id", varchar256, (col) =>
      col.primaryKey().defaultTo(sql`(uuid())`)
    )
    .execute();

  await db.schema
    .createTable("ImageToken")
    .ifNotExists()
    .addColumn("userId", varchar256, (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("tokens", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("OtherProperties")
    .ifNotExists()
    .addColumn("property", varchar256, (col) => col.primaryKey())
    .addColumn("value", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Schema>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute();
  await db.schema.dropTable("Session").ifExists().execute();
  await db.schema.dropTable("User").ifExists().execute();
  await db.schema.dropTable("VerificationToken").ifExists().execute();

  await db.schema.dropTable("Icon").ifExists().execute();
  await db.schema.dropTable("ImageToken").ifExists().execute();
  await db.schema.dropTable("OtherProperties").ifExists().execute();
}
