import { DBInterface } from "@/db/db-interface";
import { up } from "@/db/kysely/migration";
import { TExtra, createSQLiteDB } from "@/db/kysely/sqlite.db";
const db = createSQLiteDB("sqlite.db");
up(db.adapter());