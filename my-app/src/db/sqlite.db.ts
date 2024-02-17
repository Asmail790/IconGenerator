import IDB from "./interface.db";
import { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import { icons, imageTokens, totalCost, users } from "schema";
import { and, eq, inArray, count, like, or } from "drizzle-orm";

export default class SQliteDB implements IDB {
  private _db: BetterSQLite3Database<Record<string, never>>;
  constructor(db: BetterSQLite3Database<Record<string, never>>) {
    this._db = db;
  }
  async removeImage(imageId: string, userId: string) {
    await this._db
      .delete(icons)
      .where(and(eq(icons.id, imageId), eq(icons.owner, userId)));
  }

  private createSQLImageConditions(args: {
    userId: string;
    description?: string | undefined;
    color?: string | undefined;
    style?: string | undefined;
  }) {
    const { description, userId, color, style } = args;

    type TConditions =
      | ReturnType<typeof and>
      | ReturnType<typeof or>
      | ReturnType<typeof like>
      | ReturnType<typeof eq>;
    let sqlConditions: TConditions[] = [];

    if (description !== undefined && description !== "") {
      const wordMatches = description
        .split(" ")
        .map((word) => like(icons.description, `%${word}%`));

      sqlConditions.push(or(...wordMatches));
    }

    if (color !== undefined && color !== "") {
      sqlConditions.push(like(icons.color, `%${color}%`));
    }

    if (style !== undefined && style !== "") {
      sqlConditions.push(like(icons.style, `%${style}%`));
    }

    sqlConditions.push(eq(icons.owner, userId));
    return sqlConditions;
  }
  async totalNumberOfImages(args: {
    userId: string;
    description?: string | undefined;
    color?: string | undefined;
    style?: string | undefined;
  }): Promise<number> {
    const { description, userId, color, style } = args;
    const sqlConditions = this.createSQLImageConditions({
      description,
      userId,
      color,
      style,
    });

    const [item] = await this._db
      .select({ totalNumberOfImages: count() })
      .from(icons)
      .where(and(...sqlConditions));
    if (item === undefined) {
      throw new Error("undefined item");
    }
    return item.totalNumberOfImages;
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
    if (args.imageIds.length === 0) {
      return [];
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

  async createTokens(userId: string, numberOfTokens: number): Promise<void> {
    await this._db
      .insert(imageTokens)
      .values({ owner: userId, tokens: numberOfTokens });
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
    const { description, userId, color, style, limit, offset } = args;
    const sqlConditions = this.createSQLImageConditions({
      description,
      userId,
      color,
      style,
    });

    const items = await this._db
      .select({ id: icons.id })
      .from(icons)
      .where(and(...sqlConditions))
      .offset(offset)
      .limit(limit);
    
      console.log("ids")
    return items.map((item) => item.id);
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
  async decreaseToken(args: {
    userId: string;
    tokensSpend: number;
  }): Promise<void> {
    const { userId, tokensSpend } = args;
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
      const tokensLeft = tokens - tokensSpend;
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
