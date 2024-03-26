import Database from "better-sqlite3";
import { type Database as Sqlite3Database } from "better-sqlite3";
import { DBInterface, totalCostKey } from "../interface";
import { Kysely, SqliteDialect } from "kysely";
import { v4 as uuidv4 } from "uuid";
import { Schema } from "../schema";
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
  deleteAccount,
  transaction,
} from "../base-implementation";

export type TExtra = {
  originalDB: () => Sqlite3Database;
};

export function createSQLiteDBSimple(url: string): DBInterface & TExtra {
  const db = new Database(url);
  db.function("uuid", () => uuidv4());

  const adapter = new Kysely<Schema>({
    dialect: new SqliteDialect({
      database: db,
    }),
  });

  const dbinterface = createSQLiteDB(adapter);
  return {
    ...dbinterface,
    originalDB() {
      return db;
    },
  };
}
export function createSQLiteDB(adapter: Kysely<Schema>): DBInterface {
  // const db = new Database(url);
  // db.function("uuid", () => uuidv4());

  // const adapter = new Kysely<Schema>({
  //   dialect: new SqliteDialect({
  //     database: db,
  //   }),
  // });

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
        dbConstructor: createSQLiteDB,
        isolationLevel,
        transactionLambda,
      }),
  };
}
