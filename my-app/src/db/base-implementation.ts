import { ExpressionBuilder, IsolationLevel, Kysely } from "kysely";
import { Schema } from "./schema";
import {
  DBInterface,
  decreaseToken as TDecreaseToken,
  getImageData as TGetImageData,
  getImageIds as TGetImageIds,
  getImageProperties as TGetImageProperties,
  removeImage as TRemoveImage,
  saveImage as TSaveImage,
  setTokens as TSetTokens,
  totalNumberOfImages as TTotalNumberOfImages,
  totalCostKey,
} from "./interface";

// https://stackoverflow.com/questions/4034976/difference-between-read-commited-and-repeatable-read-in-sql-server
/*


    Read committed is an isolation level that guarantees that any data read was committed at the moment is read. It simply restricts the reader from seeing any intermediate, uncommitted, 'dirty' read. It makes no promise whatsoever that if the transaction re-issues the read, will find the Same data, data is free to change after it was read.

    Repeatable read is a higher isolation level, that in addition to the guarantees of the read committed level, it also guarantees that any data read cannot change, if the transaction reads the same data again, it will find the previously read data in place, unchanged, and available to read.

    The next isolation level, serializable, makes an even stronger guarantee: in addition to everything repeatable read guarantees, it also guarantees that no new data can be seen by a subsequent read.

    Say you have a table T with a column C with one row in it, say it has the value '1'. And consider you have a simple task like the following:

    BEGIN TRANSACTION;
    SELECT * FROM T;
    WAITFOR DELAY '00:01:00'
    SELECT * FROM T;
    COMMIT;

    That is a simple task that issue two reads from table T, with a delay of 1 minute between them.
    under READ COMMITTED, the second SELECT may return any data. A concurrent transaction may update the record, delete it, insert new records. The second select will always see the new data.
    under REPEATABLE READ the second SELECT is guaranteed to display at least the rows that were returned from the first SELECT unchanged. New rows may be added by a concurrent transaction in that one minute, but the existing rows cannot be deleted nor changed.
    under SERIALIZABLE reads the second select is guaranteed to see exactly the same rows as the first. No row can change, nor deleted, nor new rows could be inserted by a concurrent transaction.

*/

export function searchWords(
  description: string,
  eb: ExpressionBuilder<Schema, "Icon">
) {
  const matches = description
    .split(" ")
    .map((word) => eb("Icon.description", "like", `%${word}%`));

  return eb.or(matches);
}

export async function addToTotalCost(
  kysely: Kysely<Schema>,
  totalCostKey: string,
  cost: number
) {
  // isolation level set to "serializable" since we only have one row.

  const [item] = await kysely
    .selectFrom("OtherProperties")
    .select("value")
    .where("property", "=", totalCostKey)
    .limit(1)
    .execute();

  // TODO execute one query only and make transaction
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
}

export async function getUserId(kysely: Kysely<Schema>, email: string) {
  const result = await kysely
    .selectFrom("User")
    .select("User.id")
    .where("User.email", "=", email)
    .executeTakeFirstOrThrow();
  return result.id;
}

export async function saveImage(
  kysely: Kysely<Schema>,
  args: Parameters<TSaveImage>[0]
) {
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
}

export async function getImageData(
  kysely: Kysely<Schema>,
  args: Parameters<TGetImageData>[0]
) {
  const { imageId, userId } = args;
  const arrayBuffer = await kysely
    .selectFrom("Icon")
    .select("Icon.data")
    .where((e) => e.and([e("userId", "=", userId), e("Icon.id", "=", imageId)]))
    .executeTakeFirstOrThrow()
    .then((q) => q.data);

  return Buffer.from(arrayBuffer);
}

export async function removeImage(
  kysely: Kysely<Schema>,
  args: Parameters<TRemoveImage>[0]
) {
  const { imageId, userId } = args;
  await kysely
    .deleteFrom("Icon")
    .where((e) =>
      e.and([e("Icon.userId", "=", userId), e("Icon.id", "=", imageId)])
    )
    .execute();
}

export async function getImageProperties(
  kysely: Kysely<Schema>,
  args: Parameters<TGetImageProperties>[0]
) {
  const { imageIds, userId } = args;

  if (imageIds.length === 0) {
    return [];
  }

  const result = await kysely
    .selectFrom("Icon")
    .select(["Icon.color", "Icon.id", "Icon.style", "Icon.description"])
    .where((e) =>
      e.and([e("Icon.userId", "=", userId), e("Icon.id", "in", imageIds)])
    )
    .execute();

  return result;
}

export async function totalNumberOfImages(
  kysely: Kysely<Schema>,
  args: Parameters<TTotalNumberOfImages>[0]
) {
  const { userId, color, description, style } = args;

  const result = await kysely
    .selectFrom("Icon")
    .select((eb) => eb.fn.countAll().as("num_images"))
    .where((eb) => {
      let conditions = [];

      conditions.push(eb("Icon.userId", "=", userId));

      if (color != undefined && color !== "") {
        conditions.push(eb("Icon.color", "=", color));
      }
      if (description != undefined && description !== "") {
        const wordMatch = searchWords(description, eb);
        conditions.push(wordMatch);
      }
      if (style != undefined && style !== "") {
        conditions.push(eb("Icon.style", "=", style));
      }
      return eb.and(conditions);
    })
    .executeTakeFirstOrThrow();

  return parseInt(String(result.num_images));
}

export async function getTotalCost(
  kysely: Kysely<Schema>,
  totalCostKey: string
) {
  const result = await kysely
    .selectFrom("OtherProperties")
    .select("value")
    .where("property", "=", totalCostKey)
    .executeTakeFirst();

  if (result == undefined) {
    return 0;
  }

  return parseFloat(result.value);
}

export async function setTokens(
  kysely: Kysely<Schema>,
  args: Parameters<TSetTokens>[0]
) {
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
}

export async function decreaseToken(
  kysely: Kysely<Schema>,
  args: Parameters<TDecreaseToken>[0]
) {
  const { tokensSpend, userId } = args;

  // isolation level set to "repeatable read" since we want the row to be read correctly.
  await kysely
    .updateTable("ImageToken")
    .set((eb) => ({
      userId: userId,
      tokens: eb("tokens", "-", tokensSpend),
    }))
    .where("userId", "=", args.userId)
    .execute();
}

export async function getNumberOfTokens(
  kysely: Kysely<Schema>,
  userId: string
) {
  // isolation level set to "repeatable read" since we want the row to be read correctly.

  return await kysely
    .selectFrom("ImageToken")
    .select("tokens")
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow()
    .then((r) => r.tokens);
}

export async function getImageIds(
  kysely: Kysely<Schema>,
  args: Parameters<TGetImageIds>[0]
) {
  const { userId, limit, offset, color, description, style } = args;
  const result = await kysely
    .selectFrom("Icon")
    .select("id")
    .where((eb) => {
      let conditions = [];

      conditions.push(eb("Icon.userId", "=", userId));

      if (color != undefined && color != "") {
        conditions.push(eb("Icon.color", "=", color));
      }
      if (description != undefined && description != "") {
        const wordMatch = searchWords(description, eb);

        conditions.push(wordMatch);
      }
      if (style != undefined && style != "") {
        conditions.push(eb("Icon.style", "=", style));
      }
      return eb.and(conditions);
    })
    .offset(offset)
    .limit(limit)
    .execute()
    .then((q) => q.map((item) => item.id));

  return result;
}

export async function deleteAccount(kysely: Kysely<Schema>, userId: string) {
  await kysely.deleteFrom("User").where("User.id", "=", userId).execute();
}

export async function transaction<X>(
  adapter: Kysely<Schema>,
  args: {
    transactionLambda: (db: DBInterface) => Promise<X>;
    isolationLevel: IsolationLevel;
    dbConstructor: (adapter: Kysely<Schema>) => DBInterface;
  }
) {
  const {
    isolationLevel: isolationLevel,
    transactionLambda,
    dbConstructor,
  } = args;
  return await adapter
    .transaction()
    .setIsolationLevel(isolationLevel)
    .execute(async (trx) => {
      const db = dbConstructor(trx);
      return await transactionLambda(db);
    });
}
