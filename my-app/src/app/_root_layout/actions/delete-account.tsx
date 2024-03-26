"use server"

import { getUserEmail } from "@/app/api/auth/[...nextauth]/config"
import { defaultGetUserId  as getUserId} from "@/app/api/auth/_logic/get-user-id"
import { defaultUserRemover as removeUser } from "../logic/delete-account"





export async function deleteUser(){
    const email = await getUserEmail()
    const userId = await getUserId(email)
    await removeUser(userId)
}