import { DBInterface } from "@/db/db-interface";
import { db } from "@/global.config/db";
import { userTokensGranted } from "@/global.config/userTokensGranted";

async function createTokens(userId:string,db:DBInterface,numberOfTokens:number){
    db.setTokens({userId,numberOfTokens})
}


export function createTokenCreator(db:DBInterface,numberOfTokens:number){
    return (userId:string) => createTokens(userId,db,numberOfTokens)
}

export const defaultCreateTokens = createTokenCreator(db,userTokensGranted)