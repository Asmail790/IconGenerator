import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";

async function getNumberOfTokens(args:{db:IDB,userId:string}){
    return args.db.getNumberOfTokens(args.userId)
}


export function createImageTokenGetter(db:IDB){
    return (userId:string) =>  getNumberOfTokens({db,userId})
    
}

export const defaultImageTokenGetter = createImageTokenGetter(db)


