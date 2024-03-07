import { ExpressionBuilder, Kysely } from "kysely";
import { Schema } from "./schema";
import {
  decreaseToken,
  getImageData,
  getImageIds,
  getImageProperties,
  removeImage,
  saveImage,
  setTokens,
  totalNumberOfImages,
} from "./interface";

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
  args: Parameters<saveImage>[0]
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
  args: Parameters<getImageData>[0]
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
  args: Parameters<removeImage>[0]
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
  args: Parameters<getImageProperties>[0]
) {
  const { imageIds, userId } = args;

  if (imageIds.length ===0){
    return []
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
  args: Parameters<totalNumberOfImages>[0]
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

export async function getTotalCost(kysely: Kysely<Schema>, totalCostKey: string) {
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
}

export async function setTokens(
  kysely: Kysely<Schema>,
  args: Parameters<setTokens>[0]
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
  args: Parameters<decreaseToken>[0]
) {
  const { tokensSpend, userId } = args;
  await kysely
    .updateTable("ImageToken")
    .set((eb) => ({
      userId: userId,
      tokens: eb("tokens", "-", tokensSpend),
    }))
    .where("userId", "=", args.userId)
    .execute();
}

export async function getNumberOfTokens(kysely: Kysely<Schema>, userId: string) {
  return await kysely
    .selectFrom("ImageToken")
    .select("tokens")
    .where("userId", "=", userId)
    .executeTakeFirstOrThrow()
    .then((r) => r.tokens);
}

export async function getImageIds(
  kysely: Kysely<Schema>,
  args: Parameters<getImageIds>[0]
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
