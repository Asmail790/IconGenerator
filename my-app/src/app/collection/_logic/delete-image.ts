import { URLtoImageID } from "@/app/api/image/[imageID]/_logic/url-converter";
import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";

async function removeImage(args:{db:IDB,url:string,userId:string,imageIdGetter:(url:string) => string}){
    const {db,imageIdGetter:getImageId ,userId,url} = args
    const imageId = getImageId(url)
    await db.removeImage(imageId,userId)
}


export function createImageRemover(args:{db:IDB,imageIdGetter:(url:string) => string}){
    return (url:string,userId:string) => removeImage({...args,url,userId})
}

export const defaultImageRemover = createImageRemover({db, imageIdGetter:URLtoImageID})


