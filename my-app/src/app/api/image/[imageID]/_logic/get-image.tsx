import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";









async function getImage(args:{db:IDB,userId:string,imageId:string}){
    const {db,userId,imageId} = args
       
    const image =  db.getImageData({userId,imageId})
    return image

}

export function createImageGetter(db:IDB){
    return async (args:{userId:string,imageId:string}) => getImage({...args,db})
}


export const defaultImageGetter = createImageGetter(db)