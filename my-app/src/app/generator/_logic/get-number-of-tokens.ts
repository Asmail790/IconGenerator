import { DBInterface } from "@/db/removeImage";
import { db } from "@/global.config/db";

type DBUtils = Pick<DBInterface,"getNumberOfTokens" >
async function getNumberOfTokens(args:{db:DBUtils,userId:string}){
    return args.db.getNumberOfTokens(args.userId)
}


export function createImageTokenGetter(db:DBUtils){
    return (userId:string) =>  getNumberOfTokens({db,userId})
    
}

export const defaultImageTokenGetter = createImageTokenGetter(db)


