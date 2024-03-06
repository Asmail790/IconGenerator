import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";








type DBUtils = Pick<DBInterface,"getImageData">
async function getImage(args:{db:Promise<DBUtils>,userId:string,imageId:string}){
    const {userId,imageId} = args
    const db = await args.db
    const image =  db.getImageData({userId,imageId})
    return image

}

export function createImageGetter(db:Promise<DBUtils>){
    return async (args:{userId:string,imageId:string}) => getImage({...args,db})
}


export const defaultImageGetter = createImageGetter(promiseDB)