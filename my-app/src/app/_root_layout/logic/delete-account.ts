import { DBInterface } from "@/db/interface"
import { promiseDB } from "@/global.config/db";
async function deleteUser(db_:Promise<Pick<DBInterface,"deleteAccount">>,userId:string){

    const db = await db_
    await db.deleteAccount(userId)

}


export function createUserRemover(db_:Promise<Pick<DBInterface,"deleteAccount">>){
    return (userId:string) => deleteUser(db_,userId)
}


export const defaultUserRemover = createUserRemover(promiseDB)