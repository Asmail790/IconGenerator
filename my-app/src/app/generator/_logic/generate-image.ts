import {
  ImageCostCalculator,
  ImageGenerator,
} from "@/image-generator/generator.interface";
import { db } from "@/global.config/db";
import { calculateCost, generate } from "@/global.config/generator";
import { totalCostLimit } from "@/global.config/totalCostLimit";
import { DBInterface } from "@/db/removeImage";



type TGenerateSuccessful = {
  isSuccess: true;
  imageUrls: string[];
  ImageTokensLeft:number
};

type TGenerateUnsuccessful = {
  isSuccess: false;
  message: string;
};

export type TGenerateState = (TGenerateSuccessful | TGenerateUnsuccessful) 

type DBUtils = Pick<DBInterface,"decreaseToken"|"getNumberOfTokens">
async function generateImage(args: {
  style: string;
  color: string;
  description: string;
  numberOfImages: number;
  userId: string;
  db:DBUtils
  generator: ImageGenerator;
  costCalculator: ImageCostCalculator;
  totalCostLimit: number;
}): Promise<TGenerateState> {
  const { style, color, description, numberOfImages,userId, generator } = args;

  const prompt = `Draw icon with style of ${style}, with background color of "${color}" and that fits the following description "${description}."`;
  const imageUrls = await generator({ numberOfImages, prompt });
  
  await db.decreaseToken({userId,tokensSpend:numberOfImages})
  const ImageTokensLeft = await db.getNumberOfTokens(userId)
  return {
    ImageTokensLeft,
    isSuccess: true,
    imageUrls
  };
}

export function createImageGenerator(config: {
  db: DBUtils
  generator: ImageGenerator;
  costCalculator: ImageCostCalculator;
  totalCostLimit: number;
}) {
  return (requestArgs: {
    style: string;
    color: string;
    description: string;
    userId: string;
    numberOfImages: number;
  }) => generateImage({ ...requestArgs, ...config });
}

export const defaultImageGenerator = createImageGenerator({db,generator:generate,costCalculator:calculateCost,totalCostLimit})