import { DBInterface } from "@/db/db-interface";
import { db } from "@/global.config/db";








type DBUtils = Pick<DBInterface,"getImageData">
async function getImage(args:{db:DBUtils,userId:string,imageId:string}){
    const {db,userId,imageId} = args
       
    const image =  db.getImageData({userId,imageId})
    return image

}

export function createImageGetter(db:DBUtils){
    return async (args:{userId:string,imageId:string}) => getImage({...args,db})
}


export const defaultImageGetter = createImageGetter(db)