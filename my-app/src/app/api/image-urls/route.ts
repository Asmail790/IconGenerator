import { auth } from "../auth/[...nextauth]/route"
import { icons,users } from "../../../../schema"
import { db } from "@/global.config/db"
import { eq } from "drizzle-orm"
import { Session } from "next-auth"
export async function GET(request: Request) {
  const session = await auth()

  if (session === null){
    return Response.json({ imageUrls:[]})
  }

  const email = session.user?.email
  if (email===undefined || email === null){
    throw Error("email is undefined")
  }


  // improve latter
  const id =( await db.select({
    userId:users.id
  }).from(users).where(eq(users.email,email)))[0].userId


  const result = await db.select({
    imageID:icons.id,

  }).from(icons).where(eq(icons.owner, id));


  return Response.json(result)
}
