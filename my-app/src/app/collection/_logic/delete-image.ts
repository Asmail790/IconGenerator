import { URLtoImageID } from "@/app/api/image/[imageID]/_logic/url-converter";
import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";


type DBUtils = Pick<DBInterface,"removeImage">
async function removeImage(args:{db:Promise<DBUtils>,url:string,userId:string,imageIdGetter:(url:string) => string}){
    const {imageIdGetter:getImageId ,userId,url} = args
    const db = await args.db
    const imageId = getImageId(url)
    await db.removeImage({imageId,userId})
}

export function createImageRemover(args:{db:Promise<DBUtils>,imageIdGetter:(url:string) => string}){
    return (url:string,userId:string) => removeImage({...args,url,userId})
}

export const defaultImageRemover = createImageRemover({db: promiseDB, imageIdGetter:URLtoImageID})


