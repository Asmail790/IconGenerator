import { URLtoImageID } from "@/app/api/image/[imageID]/_logic/url-converter";
import { DBInterface } from "@/db/db-interface";
import { db } from "@/global.config/db";


type DBUtils = Pick<DBInterface,"removeImage">
async function removeImage(args:{db:DBUtils,url:string,userId:string,imageIdGetter:(url:string) => string}){
    const {db,imageIdGetter:getImageId ,userId,url} = args
    const imageId = getImageId(url)
    await db.removeImage({imageId,userId})
}

export function createImageRemover(args:{db:DBUtils,imageIdGetter:(url:string) => string}){
    return (url:string,userId:string) => removeImage({...args,url,userId})
}

export const defaultImageRemover = createImageRemover({db, imageIdGetter:URLtoImageID})


