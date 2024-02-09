import {
  ImageCostCalculator,
  ImageGenerator,
} from "@/image-generator/generator.interface";
import IDB from "@/db/interface.db";
import { db } from "@/global.config/db";
import { calculateCost, generate } from "@/global.config/generator";
import { totalCostLimit } from "@/global.config/totalCostLimit";

type TGenerateOptions = {
  description: string;
  color: string;
  style: string;
};

type TGenerateSuccessful = {
  isSuccess: true;
  imageUrls: string[];
};

type TGenerateUnsuccessful = {
  isSuccess: false;
  messages: string;
};

export type TGenerateState = (TGenerateSuccessful | TGenerateUnsuccessful) 

async function generateImage(args: {
  style: string;
  color: string;
  description: string;
  numberOfImages: number;
  userId: string;
  db: IDB;
  generator: ImageGenerator;
  costCalculator: ImageCostCalculator;
  totalCostLimit: number;
}): Promise<TGenerateState> {
  const { style, color, description, numberOfImages, generator } = args;

  const prompt = `Draw icon with style of ${style}, with background color of "${color}" and that fits the following description "${description}."`;
  const imageUrls = await generator({ numberOfImages, prompt });
  return {
    isSuccess: true,
    imageUrls
  };
}

export function createImageGenerator(config: {
  db: IDB;
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