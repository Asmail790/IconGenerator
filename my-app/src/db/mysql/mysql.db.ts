import { PoolOptions, createPool } from "mysql2"; // do not use 'mysql2/promises'!
import { IsolationLevel, Kysely, MysqlDialect } from "kysely";
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

export type TExtra = {
  originalDB: () => ReturnType<typeof createPool>;
};

export function createMySQLDBSimple(args: PoolOptions): DBInterface & TExtra {
  const db = createPool(args);
  const adapter = new Kysely<Schema>({
    dialect: new MysqlDialect({ pool: db }),
  });

  const dbinterface = createMySQLDB(adapter);

  return {
    ...dbinterface,
    originalDB() {
      return db;
    },
  };
}

export function createMySQLDB(adapter: Kysely<Schema>): DBInterface {
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
        dbConstructor: createMySQLDB,
        isolationLevel,
        transactionLambda,
      }),
  };
}
