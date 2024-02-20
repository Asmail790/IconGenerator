import Database from "better-sqlite3";
import { type Database as Sqlite3Database } from "better-sqlite3";
import { DBInterface } from "../db-interface";
import { Kysely, SqliteDialect, ExpressionBuilder } from "kysely";
import { v4 as uuidv4 } from "uuid";
import { KIDatabase } from "./schema";

export type TExtra = {
  originalDB: () => Sqlite3Database;
  adapter: () => Kysely<KIDatabase>;
};
export function createSQLiteDB(url: string): DBInterface & TExtra {
  const totalCostKey = "totalCost";
  const data = new Database(url);
  data.function("uuid", () => uuidv4());

  const kysely = new Kysely<KIDatabase>({
    dialect: new SqliteDialect({
      database: data,
    }),
  });

  function searchWords(
    description: string,
    eb: ExpressionBuilder<KIDatabase, "Icon">
  ) {
    const matches = description
      .split(" ")
      .map((word) => eb("Icon.description", "like", `%${word}%`));

    return eb.or(matches);
  }

  return {
    originalDB() {
      return data;
    },
    adapter() {
      return kysely;
    },
    async addToTotalCost(cost: number) {
      const [item] = await kysely
        .selectFrom("OtherProperties")
        .select("value")
        .where("property", "=", totalCostKey)
        .limit(1)
        .execute();

      // TODO excute one query only and make transaction
      const firstTime = item === undefined;
      if (firstTime) {
        await kysely
          .insertInto("OtherProperties")
          .values({
            property: totalCostKey,
            value: String(cost),
          })
          .execute();
        return;
      }

      if (Number.isNaN(item.value)) {
        throw Error("not valid totalCost number");
      }

      const totalCost = parseFloat(item.value);
      const newTotal = totalCost + cost;
      await kysely
        .updateTable("OtherProperties")
        .set({
          value: String(newTotal),
        })
        .where("property", "=", totalCostKey)
        .execute();
    },
    async getUserId(email: string) {
      const result = await kysely
        .selectFrom("User")
        .select("User.id")
        .where("User.email", "=", email)
        .executeTakeFirstOrThrow();
      return result.id;
    },
    async saveImage(args) {
      const { color, style, userId, data, description } = args;
      await kysely
        .insertInto("Icon")
        .values({
          color,
          style,
          userId,
          description,
          data,
        })
        .execute();
    },
    async getImageData(args) {
      const { imageId, userId } = args;
      const arrayBuffer = await kysely
        .selectFrom("Icon")
        .select("Icon.data")
        .where((e) =>
          e.and([e("userId", "=", userId), e("Icon.id", "=", imageId)])
        )
        .executeTakeFirstOrThrow()
        .then((q) => q.data);

      return Buffer.from(arrayBuffer);
    },

    async removeImage(args) {
      const { imageId, userId } = args;
      await kysely
        .deleteFrom("Icon")
        .where((e) =>
          e.and([e("Icon.userId", "=", userId), e("Icon.id", "=", imageId)])
        )
        .execute();
    },
    async getImageProperties(args) {
      const { imageIds, userId } = args;

      const result = await kysely
        .selectFrom("Icon")
        .select(["Icon.color", "Icon.id", "Icon.style", "Icon.description"])
        .where((e) =>
          e.and([e("Icon.userId", "=", userId), e("Icon.id", "in", imageIds)])
        )
        .execute();

      return result;
    },
    async totalNumberOfImages(args) {
      const { userId, color, description, style } = args;

      const result = await kysely
        .selectFrom("Icon")
        .select((eb) => eb.fn.countAll<number>().as("num_images"))
        .where((eb) => {
          let conditions = [];

          conditions.push(eb("Icon.userId", "=", userId));

          if (color != undefined && color !=="")  {
            conditions.push(eb("Icon.color", "=", color));
          }
          if (description != undefined && description !=="") {
            const wordMatch = searchWords(description, eb);
            conditions.push(wordMatch);
          }
          if (style != undefined && style !=="") {
            conditions.push(eb("Icon.style", "=", style));
          }
          return eb.and(conditions);
        })
        .executeTakeFirstOrThrow();

      return result.num_images;
    },

    async getTotalCost() {
      // make it a SQL function
      // instead of application code
      const result = await kysely
        .selectFrom("OtherProperties")
        .select("value")
        .where("property", "=", totalCostKey)
        .executeTakeFirst();

      if (result == undefined) {
        return 0;
      }

      return parseFloat(result.value);
    },
    async setTokens(args) {
      const { numberOfTokens, userId } = args;

      const userRegistered = await kysely
        .selectFrom("ImageToken")
        .select("tokens")
        .where("userId", "=", userId)
        .execute()
        .then((r) => (0 < r.length ? true : false));

      if (userRegistered) {
        await kysely
          .updateTable("ImageToken")
          .set({
            tokens: args.numberOfTokens,
          })
          .where("userId", "=", args.userId)
          .execute();
        return;
      }

      await kysely
        .insertInto("ImageToken")
        .values({
          tokens: numberOfTokens,
          userId: userId,
        })
        .execute();
    },
    async decreaseToken(args) {
      const { tokensSpend, userId } = args;
      await kysely
        .updateTable("ImageToken")
        .set((eb) => ({
          userId: userId,
          tokens: eb("tokens", "-", tokensSpend),
        }))
        .where("userId", "=", args.userId)
        .execute();
    },
    async getNumberOfTokens(userId) {
      return await kysely
        .selectFrom("ImageToken")
        .select("tokens")
        .where("userId", "=", userId)
        .executeTakeFirstOrThrow()
        .then((r) => r.tokens);
    },
    async getImageIds(args) {
      const { userId, limit, offset, color, description, style } = args;
      const result = await kysely
        .selectFrom("Icon")
        .select("id")
        .where((eb) => {
          let conditions = [];

          conditions.push(eb("Icon.userId", "=", userId));

          if (color != undefined && color !="") {
            conditions.push(eb("Icon.color", "=", color));
          }
          if (description != undefined && description  != "") {
            const wordMatch = searchWords(description, eb);

            conditions.push(wordMatch);
          }
          if (style != undefined && style  != "") {
            conditions.push(eb("Icon.style", "=", style));
          }
          return eb.and(conditions);
        })
        .offset(offset)
        .limit(limit)
        .execute()
        .then((q) => q.map((item) => item.id));

      return result;
    },
  };
}
