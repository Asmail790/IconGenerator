"use server"
import "server-only"
import { defaultImageRemover as removeImage } from "../_logic/delete-image"
import { z } from "zod"
import { defaultGetUserId as getUserId } from "@/app/api/auth/_logic/get-user-id"
import { revalidatePath } from "next/cache"
import { getUserEmail } from "@/app/api/auth/[...nextauth]/config"


export async function deleteImage(imageUrl:string){
    const email = await getUserEmail()
    const userId =await getUserId(email)
    await removeImage(imageUrl,userId)
    revalidatePath('/collection')
}