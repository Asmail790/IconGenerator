import { DBInterface } from "@/db/interface";
import { promiseDB } from "@/global.config/db";

async function getTotalCost(db_: Promise<Pick<DBInterface, "getTotalCost">>) {
  const db = await db_
  return db.getTotalCost();
}

export function createTotalCostGetter(db: Promise<Pick<DBInterface, "getTotalCost">>) {
  return () => getTotalCost(db);
}

export const defaultTotalCostGetter = createTotalCostGetter(promiseDB);
