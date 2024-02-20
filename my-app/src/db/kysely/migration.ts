import { Kysely, sql } from "kysely";
import { KIDatabase } from "./schema";

export async function up(db: Kysely<KIDatabase>): Promise<void> {
  await db.schema
    .createTable("User")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`(uuid())`))
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("emailVerified", "text")
    .addColumn("image", "text")
    .execute();

  await db.schema
    .createTable("Account")
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`(uuid())`))
    .addColumn("userId", "text", (col) =>
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
    .ifNotExists()
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`(uuid())`))
    .addColumn("userId", "text", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("sessionToken", "text", (col) => col.notNull().unique())
    .addColumn("expires", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("VerificationToken")
    .ifNotExists()
    .addColumn("identifier", "text", (col) => col.notNull())
    .addColumn("token", "text", (col) => col.notNull().unique())
    .addColumn("expires", "text", (col) => col.notNull())
    .execute();

  await db.schema
    .createIndex("Account_userId_index")
    .ifNotExists()
    .on("Account")
    .column("userId")
    .execute();

  await db.schema
    .createIndex("Session_userId_index")
    .ifNotExists()
    .on("Session")
    .column("userId")
    .execute();

  await db.schema
    .createTable("Icon")
    .ifNotExists()
    .addColumn("userId", "text", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("data", "blob", (col) => col.notNull())
    .addColumn("color", "text", (col) => col.notNull())
    .addColumn("style", "text", (col) => col.notNull())
    .addColumn("description", "text", (col) => col.notNull())
    .addColumn("id", "text", (col) => col.primaryKey().defaultTo(sql`(uuid())`))
    .execute();

  await db.schema
    .createTable("ImageToken")
    .ifNotExists()
    .addColumn("userId", "text", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("tokens", "integer", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("OtherProperties")
    .ifNotExists()
    .addColumn("property", "text", (col) => col.primaryKey())
    .addColumn("value", "text", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<KIDatabase>): Promise<void> {
  await db.schema.dropTable("Account").ifExists().execute();
  await db.schema.dropTable("Session").ifExists().execute();
  await db.schema.dropTable("User").ifExists().execute();
  await db.schema.dropTable("VerificationToken").ifExists().execute();

  await db.schema.dropTable("Icon").ifExists().execute();
  await db.schema.dropTable("ImageToken").ifExists().execute();
  await db.schema.dropTable("OtherProperties").ifExists().execute();
}
