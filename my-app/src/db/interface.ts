import { Kysely } from "kysely";
import { Schema } from "./schema";

export type ImageProps = {
  color: string;
  style: string;
  description: string;
  id: string;
}[];
export type removeImage = (args: {
  imageId: string;
  userId: string;
}) => Promise<void>;
export type totalNumberOfImages = (args: {
  userId: string;
  description?: string | undefined;
  color?: string | undefined;
  style?: string | undefined;
}) => Promise<number>;
export type getImageProperties = (args: {
  userId: string;
  imageIds: string[];
}) => Promise<ImageProps>;
export type getUserId = (email: string) => Promise<string>;
export type getNumberOfTokens = (userId: string) => Promise<number>;
export type getImageIds = (args: {
  userId: string;
  description?: string | undefined;
  color?: string | undefined;
  style?: string | undefined;
  offset: number;
  limit: number;
}) => Promise<string[]>;
export type getTotalCost = () => Promise<number>;
export type getImageData = (args: {
  userId: string;
  imageId: string;
}) => Promise<Buffer>;
export type saveImage = (args: {
  userId: string;
  data: Buffer;
  description: string;
  color: string;
  style: string;
}) => Promise<void>;
export type decreaseToken = (args: {
  userId: string;
  tokensSpend: number;
}) => Promise<void>;
export type setTokens = (args: {
  userId: string;
  numberOfTokens: number;
}) => Promise<void>;
export type addToTotalCost = (cost: number) => Promise<void>;

export const totalCostKey = "totalCost";

export type DBInterface = {
  removeImage: removeImage;
  totalNumberOfImages: totalNumberOfImages;
  getImageProperties: getImageProperties;
  getUserId: getUserId;
  getNumberOfTokens: getNumberOfTokens;
  getImageIds: getImageIds;
  getTotalCost: getTotalCost;
  getImageData: getImageData;
  saveImage: saveImage;
  decreaseToken: decreaseToken;
  addToTotalCost: addToTotalCost;
  setTokens: setTokens;
  adapter:()=>Kysely<Schema>
};
