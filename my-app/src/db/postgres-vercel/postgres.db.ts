import { Kysely, PostgresDialect } from "kysely";
import { Schema } from "../schema";
import { DBInterface, totalCostKey } from "../interface";
import {
  addToTotalCost,
  decreaseToken,
  deleteAccount,
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
  transaction,
} from "../base-implementation";
import { createKysely } from "@vercel/postgres-kysely";


export function createPostgresDBSimple():DBInterface{
  const adapter = createKysely<Schema>();
  const dbInterface = createPostgresDB(adapter)

  return dbInterface

}

export function createPostgresDB(adapter: Kysely<Schema>): DBInterface {
  return {
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
    deleteAccount: (args) => deleteAccount(adapter, args),
    transaction: ({ isolationLevel, transactionLambda }) =>
      transaction(adapter, {
        dbConstructor: createPostgresDB,
        isolationLevel,
        transactionLambda,
      }),
  };
}
