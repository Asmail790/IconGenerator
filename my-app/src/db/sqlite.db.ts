import IDB from "./interface.db";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { icons, imageTokens, totalCost, users } from "schema";
import { and, eq, inArray,count } from "drizzle-orm";

export default class SQliteDB implements IDB {
  private _db: BetterSQLite3Database<Record<string, never>>;
  constructor(db: BetterSQLite3Database<Record<string, never>>) {
    this._db = db;
  }
  async totalNumberOfImages(args: {
    userId: string;
    description?: string | undefined;
    color?: string | undefined;
    style?: string | undefined;
    offset: number;
    limit: number;
  }): Promise<number> {
    const descriptionCondition =
    args.description !== undefined
      ? eq(icons.description, args.description)
      : undefined;
  const colorCondition =
    args.color !== undefined ? eq(icons.color, args.color) : undefined;
  const styleCondition =
    args.style !== undefined ? eq(icons.style, args.style) : undefined;

  const conditions = [
    descriptionCondition,
    colorCondition,
    styleCondition,
  ].filter(Boolean);

  const [item] = await this._db.select({totalNumberOfImages:count()}).from(icons).where(and(...conditions))
  if (item === undefined){
    throw new Error("undefined item")
  }
  return item.totalNumberOfImages
  }


  async getUserId(email: string): Promise<string> {
    const [item] = await this._db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (item === undefined) {
      throw Error(`Email${email} is undefined`);
    }
    return item.id;
  }
  async getImageProperties(args: {
    userId: string;
    imageIds: string[];
  }): Promise<
    { color: string; style: string; description: string; id: string }[]
  > {

    if (args.imageIds.length ===0){
      return []
    }


    return this._db
      .select({
        color: icons.color,
        style: icons.style,
        description: icons.description,
        id: icons.id,
      })
      .from(icons)
      .where(
        and(inArray(icons.id, args.imageIds), eq(icons.owner, args.userId))
      );
  }

  async getNumberOfTokens(userId: string): Promise<number> {
    const [item] = await this._db
      .select({ tokens: imageTokens.tokens })
      .from(imageTokens)
      .where(eq(imageTokens.owner, userId))
      .limit(1);
    if (item === undefined) {
      throw Error(`User with userId ${userId} is undefined`);
    }
    return item.tokens;
  }

  
  async getImageIds(args: {
    userId: string;
    description?: string;
    color?: string;
    style?: string;
    offset: number;
    limit: number;
  }): Promise<string[]> {
    const descriptionCondition =
      args.description !== undefined
        ? eq(icons.description, args.description)
        : undefined;
    const colorCondition =
      args.color !== undefined ? eq(icons.color, args.color) : undefined;
    const styleCondition =
      args.style !== undefined ? eq(icons.style, args.style) : undefined;

    const conditions = [
      descriptionCondition,
      colorCondition,
      styleCondition,
    ].filter(Boolean);

    const items = await this._db
      .select({ id: icons.id })
      .from(icons)
      .where(and(...conditions)).offset(args.offset).limit(args.limit)

    return items.filter(Boolean).map((item) => item.id);
  }
  async getTotalCost(): Promise<number> {
    const fixedId = 0;
    return await this._db.transaction(async (tx) => {
      const [item] = await tx
        .select({ totalCost: totalCost.cost, id: totalCost.id })
        .from(totalCost)
        .where(eq(totalCost.id, fixedId))
        .limit(1);
      if (item === undefined) {
        tx.update(totalCost).set({ cost: 0, id: fixedId });
        return 0;
      }
      return item.totalCost;
    });
  }
  async getImageData(args: {
    userId: string;
    imageId: string;
  }): Promise<Buffer> {
    const { userId, imageId } = args;
    const [item] = await this._db
      .select({ data: icons.data })
      .from(icons)
      .where(and(eq(icons.owner, userId), eq(icons.id, imageId)))
      .limit(1);
    if (item === undefined) {
      throw Error(
        `ImageData with userId ${userId} and imageId ${imageId} is undefined`
      );
    }

    return item.data;
  }
  async saveImage(args: {
    userId: string;
    data: Buffer;
    description: string;
    color: string;
    style: string;
  }): Promise<void> {
    const { userId, data, description, color, style } = args;
    await this._db
      .insert(icons)
      .values({ owner: userId, data, description, color, style });
  }
  async decreaseTokenByOne(userId: string): Promise<void> {
    await this._db.transaction(async (tx) => {
      const [item] = await tx
        .select({ token: imageTokens.tokens })
        .from(imageTokens)
        .where(eq(imageTokens.owner, userId))
        .limit(1);
      if (item === undefined) {
        throw Error(`User with userId ${userId} is undefined`);
      }
      const tokens = item.token;
      const tokensLeft = tokens - 1;
      await tx.update(imageTokens).set({ tokens: tokensLeft });
    });
  }
  async addToTotalCost(cost: number): Promise<void> {
    const fixedId = 0;
    await this._db.transaction(async (tx) => {
      const [item] = await tx
        .select({ totalCost: totalCost.cost, id: totalCost.id })
        .from(totalCost)
        .where(eq(totalCost.id, fixedId))
        .limit(1);
      if (item === undefined) {
        tx.update(totalCost).set({ cost, id: fixedId });
      } else {
        const newTotalCost = item.totalCost + cost;
        tx.update(totalCost).set({ cost: newTotalCost, id: fixedId });
      }
    });
  }
}
