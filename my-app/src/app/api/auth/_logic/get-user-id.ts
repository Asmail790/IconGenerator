import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";



async function  getUserId(email:string,db_:Promise<DBInterface>){
    const db = await db_
    return  db.getUserId(email)
}

export function createUserIdGetter(db:Promise<DBInterface>){
    return (email:string) => getUserId(email,db)
}

export const defaultGetUserId = createUserIdGetter(promiseDB)