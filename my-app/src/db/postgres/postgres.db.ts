import { Pool, PoolConfig } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import { Schema } from "../schema";
import { DBInterface, totalCostKey } from "../interface";
import {
  addToTotalCost,
  decreaseToken,
  getImageData,
  getImageIds,
  getImageProperties,
  getNumberOfTokens,
  getTotalCost,
  getUserId,
  removeImage,
  saveImage,
  setTokens,
  totalNumberOfImages,
} from "../base-implementation";


export type TExtra = {
  originalDB: () => Pool;
};

export function createPostgresDB(
  args:PoolConfig
): DBInterface & TExtra {
  const db = new Pool(args);
  const adapter = new Kysely<Schema>({
    dialect: new PostgresDialect({ pool: db }),
  });

  return {
    originalDB() {
      return db;
    },
    adapter() {
      return adapter;
    },

    addToTotalCost: async (cost) => addToTotalCost(adapter, totalCostKey, cost),
    getTotalCost: async () => getTotalCost(adapter, totalCostKey),
    decreaseToken: async (args) => decreaseToken(adapter, args),
    setTokens: async (args) => setTokens(adapter, args),
    getNumberOfTokens: async (userId) => getNumberOfTokens(adapter, userId),
    getUserId: async (email) => getUserId(adapter, email),
    saveImage: async (args) => saveImage(adapter, args),
    removeImage: async (args) => removeImage(adapter, args),
    getImageData: async (args) => getImageData(adapter, args),
    getImageIds: async (args) => getImageIds(adapter, args),
    getImageProperties: async (args) => getImageProperties(adapter, args),
    totalNumberOfImages: (args) => totalNumberOfImages(adapter, args),
  };
}
