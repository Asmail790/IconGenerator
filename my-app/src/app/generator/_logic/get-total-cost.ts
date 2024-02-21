import { DBInterface } from "@/db/kysely/interface";
import { db } from "@/global.config/db";

async function getTotalCost(db: Pick<DBInterface, "getTotalCost">) {
  return db.getTotalCost();
}

export function createTotalCostGetter(db: Pick<DBInterface, "getTotalCost">) {
  return () => getTotalCost(db);
}

export const defaultTotalCostGetter = createTotalCostGetter(db);
