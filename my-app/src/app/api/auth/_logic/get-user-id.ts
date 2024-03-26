import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";



async function  getUserId(email:string,db_:Promise<Pick<DBInterface,"getUserId">>){
    const db = await db_
    return  db.getUserId(email)
}

export function createUserIdGetter(db:Promise<Pick<DBInterface,"getUserId">>){
    return (email:string) => getUserId(email,db)
}

export const defaultGetUserId = createUserIdGetter(promiseDB)