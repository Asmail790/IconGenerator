import { DBInterface } from "@/db/removeImage";
import { db } from "@/global.config/db";


type DBUtils = Pick<DBInterface,"getTotalCost">
async function getTotalCost(db:DBUtils){
    return db.getTotalCost()
}


export function createTotalCostGetter(db:DBUtils){
    return () =>  getTotalCost(db)
    
}

export const defaultTotalCostGetter = createTotalCostGetter(db)


