
import {  createSQLiteDB } from "@/db/kysely/sqlite.db";
import { up } from "@/db/kysely/sqlite.migration";

const db = createSQLiteDB("sqlite.db");
up(db.adapter());

export { db };
