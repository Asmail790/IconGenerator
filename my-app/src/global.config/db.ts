import {createSQliteDB} from "@/db/sqlite.db";
import {db as _db} from "../../schema"
const db =  createSQliteDB(_db);
export { db };
