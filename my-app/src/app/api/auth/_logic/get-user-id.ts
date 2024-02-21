import { DBInterface } from "@/db/kysely/interface";
import { db } from "@/global.config/db";



async function  getUserId(email:string,db:DBInterface){
    return  db.getUserId(email)
}

export function createUserIdGetter(db:DBInterface){
    return (email:string) => getUserId(email,db)
}

export const defaultGetUserId = createUserIdGetter(db)