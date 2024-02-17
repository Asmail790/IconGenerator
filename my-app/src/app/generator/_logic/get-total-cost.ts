import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";

async function getTotalCost(args:{db:IDB}){
    return args.db.getTotalCost()
}


export function createTotalCostGetter(db:IDB){
    return () =>  getTotalCost({db})
    
}

export const defaultTotalCostGetter = createTotalCostGetter(db)


