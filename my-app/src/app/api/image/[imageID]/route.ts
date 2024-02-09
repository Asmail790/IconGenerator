import { eq } from "drizzle-orm"
import { icons, users } from "../../../../../schema"
import { db } from "@/global.config/db"
import { auth } from "../../auth/[...nextauth]/route"
export async function GET(request: Request,
  { params }: { params: { imageID: string }}) {
  

    
    const session = await auth()
    if (session === null){
      return Response.json({ imageUrls:[]})
    }
    
    const email = session.user?.email
    if (email===undefined || email === null){
      throw Error("email is undefined")
    }
    
    const userId = await db.getUserId(email)
    
    const image =  await db.getImageData({userId,imageId:params.imageID})

    
    return new Response(image,{headers:new Headers({ "Content-Type": "image/png"})})
}

export const mapUrl = (id:string) => `/api/image/${id}`