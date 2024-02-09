
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from 'better-sqlite3';
import * as schema from "../../../../schema"
const local = new Database('../../../../local.db');
const db = drizzle(local);


export async function getImages(username:string){
    const result = db.select({
        field1:schema.users.name
    }).from(schema.users)


    return result

} 