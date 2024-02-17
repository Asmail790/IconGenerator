import "server-only"
import { db } from "@/global.config/db";
import { imageIdToURL } from "@/app/api/image/[imageID]/_logic/url-converter";
import { DBInterface } from "@/db/db-interface";

type ImgData = {
    description: string;
    style: string;
    url: string;
    color: string;
  };
  
  type Result = {
    imageData:ImgData[],
    lastPage:number
  }
  
  type DBUtils = Pick<DBInterface,"getImageProperties"|"totalNumberOfImages"|"getImageIds">
  async function getImages(args:{db:DBUtils,style?:string,description?:string,pageIndex:number,pageSize:number,userId:string,mapUrl:(id:string) => string}):Promise<Result>{
    const {style,description,pageIndex,pageSize,userId,mapUrl,db} =args 
    const limit = pageSize
    const offset = pageSize*pageIndex

    
    const ids = await db.getImageIds({limit,offset,userId,description,style})
    const totalImages = await db.totalNumberOfImages({limit,offset,userId,description,style})
    const totalPages = Math.ceil(totalImages / pageSize);
    const lastPage = totalPages - 1;
    
    const imageData = (await db.getImageProperties({userId,imageIds:ids}))
    .map(img => {
  
      const url = mapUrl(img.id)
      return {url,description:img.description,style:img.style,color:img.color}
    })
    console.log(imageData.length)
    return {imageData,lastPage}
  }
  
  
function createGetImages(config:{db:DBUtils,mapUrl:(id:string) => string }){
    return (args:{style?:string,description?:string,pageIndex:number,pageSize:number,userId:string}) => getImages({...args,...config})
  }

  export const defaultGetImages =  createGetImages({db, mapUrl: imageIdToURL})