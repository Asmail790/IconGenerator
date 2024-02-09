import SQliteDB from "@/db/sqlite.db";
import {db as _db} from "../../schema"
const db = new  SQliteDB(_db);
export { db };
