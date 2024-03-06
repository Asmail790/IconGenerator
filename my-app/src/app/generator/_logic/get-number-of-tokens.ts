import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";

type DBUtils = Pick<DBInterface,"getNumberOfTokens" >
async function getNumberOfTokens(args:{db:Promise<DBUtils>,userId:string}){
    const db = await args.db
    return db.getNumberOfTokens(args.userId)
}


export function createImageTokenGetter(db:Promise<DBUtils>){
    return (userId:string) =>  getNumberOfTokens({db,userId})
    
}

export const defaultImageTokenGetter = createImageTokenGetter(promiseDB)


