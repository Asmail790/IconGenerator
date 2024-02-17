import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";



async function  getUserId(email:string,db:IDB){
    return  db.getUserId(email)
}

export function createUserIdGetter(db:IDB){
    return (email:string) => getUserId(email,db)
}

export const defaultGetUserId = createUserIdGetter(db)