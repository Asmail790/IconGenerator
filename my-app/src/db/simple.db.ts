import { randomUUID } from "crypto";
import IDB from "./interface.db";

type Image = {
  data: Buffer;
  description: string;
  color: string;
  style: string;
  imageId: string;
};
type UserProperty = {
  image: Image[];
  tokens: number;
  isLoggedIn: boolean;
  email: string;
};

type Storage = {
  users: Map<string, UserProperty>;
  totalCost: number;
};

type ImageProps = {
  color: string;
  style: string;
  description: string;
  id: string;
}[];

export default class SimpleDB implements IDB {
  private storage: Storage;

  private getUser(userId: string): UserProperty {
    const user = this.storage.users.get(userId);
    if (user === undefined) {
      throw new Error(`User ${userId} is undefined.`);
    }

    return user;
  }

  constructor(storage?: Storage) {
    if (storage !== undefined) {
      this.storage = storage;
      return;
    }

    this.storage = {
      totalCost: 0,
      users: new Map<string, UserProperty>(),
    };
  }
  async totalNumberOfImages(args: {
    userId: string;
    description?: string | undefined;
    color?: string | undefined;
    style?: string | undefined;
    offset: number;
    limit: number;
  }): Promise<number> {
    const { userId, description, color, style, offset, limit } = args;

    return this.getUser(userId)
    .image.filter((img) => {
      const descriptionMatch =
        description === undefined
          ? true
          : img.description.toLowerCase().includes(description.toLowerCase());
      const colorMatch = color === undefined ? true : img.color === color;
      const styleMatch = style === undefined ? true : img.style === style;
      return descriptionMatch && colorMatch && styleMatch;
    }).length

  }
  async getUserId(email: string): Promise<string> {
    for (const [userId, userData] of this.storage.users.entries()) {
      if (userData.email === email) {
        return userId;
      }
    }

    throw Error("email undefined");
  }
  async getImageProperties(args: {
    userId: string;
    imageIds: string[];
  }): Promise<ImageProps> {
    const { userId, imageIds } = args;
    return this.getUser(userId)
      .image.filter((img) => imageIds.includes(img.imageId))
      .map((img) => ({
        color: img.color,
        description: img.description,
        style: img.style,
        id: img.imageId,
      }));
  }

  async getNumberOfTokens(userId: string): Promise<number> {
    return this.getUser(userId).tokens;
  }
  async getImageIds(args: {
    userId: string;
    description?: string | undefined;
    color?: string | undefined;
    style?: string | undefined;
    offset: number;
    limit: number;
  }): Promise<string[]> {
    const { userId, description, color, style, offset, limit } = args;

    return this.getUser(args.userId)
      .image.filter((img) => {
        const descriptionMatch =
          description === undefined
            ? true
            : img.description.toLowerCase().includes(description.toLowerCase());
        const colorMatch = color === undefined ? true : img.color === color;
        const styleMatch = style === undefined ? true : img.style === style;
        return descriptionMatch && colorMatch && styleMatch;
      })
      .map((img) => img.imageId)
      .slice(offset, offset + limit);
  }
  async getTotalCost(): Promise<number> {
    return this.storage.totalCost;
  }
  async getImageData(args: {
    userId: string;
    imageId: string;
  }): Promise<Buffer> {
    const { userId, imageId } = args;
    const [img] = this.getUser(userId).image.filter(
      (img) => img.imageId === imageId
    );

    if (img === undefined) {
      throw Error(`ImageId ${imageId} is undefined`);
    }

    return img.data;
  }
  async saveImage(args: {
    userId: string;
    data: Buffer;
    description: string;
    color: string;
    style: string;
  }): Promise<void> {
    const { userId, data, description, color, style } = args;
    const imageId = randomUUID();
    this.getUser(userId).image.push({
      data,
      description,
      color,
      style,
      imageId,
    });
  }
  async decreaseTokenByOne(userId: string): Promise<void> {
    this.getUser(userId).tokens -= 1;
  }
  async addToTotalCost(cost: number): Promise<void> {
    this.storage.totalCost += cost;
  }
}
