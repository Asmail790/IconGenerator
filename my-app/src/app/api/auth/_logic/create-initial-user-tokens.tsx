import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";
import { userTokensGranted } from "@/global.config/userTokensGranted";

async function createTokens(userId:string,db_:Promise<DBInterface>,numberOfTokens:number){
    const db = await db_
    db.setTokens({userId,numberOfTokens})
}


export function createTokenCreator(db:Promise<DBInterface>,numberOfTokens:number){
    return (userId:string) => createTokens(userId,db,numberOfTokens)
}

export const defaultCreateTokens = createTokenCreator(promiseDB,userTokensGranted)