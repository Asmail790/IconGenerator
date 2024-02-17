import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";
import { userTokensGranted } from "@/global.config/userTokensGranted";

async function createTokens(userId:string,db:IDB,numberOfTokens:number){
    db.createTokens(userId,numberOfTokens)
}


export function createTokenCreator(db:IDB,numberOfTokens:number){
    return (userId:string) => createTokens(userId,db,numberOfTokens)
}

export const defaultCreateTokens = createTokenCreator(db,userTokensGranted)