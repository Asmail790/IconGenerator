import {
  ImageCostCalculator,
  ImageGenerator,
} from "@/image-generator/generator.interface";
import { promiseDB } from "@/global.config/db";
import { calculateCost, generate } from "@/global.config/generator";
import { totalCostLimit } from "@/global.config/totalCostLimit";
import { DBInterface } from "@/db/interface";



type TGenerateSuccessful = {
  isSuccess: true;
  images:{url:string,base64Img:string}[];
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
  db:Promise<DBUtils>
  generator: ImageGenerator;
  costCalculator: ImageCostCalculator;
  totalCostLimit: number;
}): Promise<TGenerateState> {
  const { style, color, description, numberOfImages,userId, generator } = args;
  const db = await args.db

  const prompt = `Generate an ${style} icon with primary color of "${color}" and that represents "${description}."`;
  const imageUrls = await generator({ numberOfImages, prompt });
  const images = await Promise.all(imageUrls.map( async url => {
    const response = await fetch(url)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const base64Img = `data:${blob.type};base64,${buffer.toString("base64")}`
    return {base64Img,url}
  }))
  
  
  await db.decreaseToken({userId,tokensSpend:numberOfImages})
  const ImageTokensLeft = await db.getNumberOfTokens(userId)
  return {
    ImageTokensLeft,
    isSuccess: true,
    images
  };
}

export function createImageGenerator(config: {
  db: Promise<DBUtils>
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

export const defaultImageGenerator = createImageGenerator({db:promiseDB,generator:generate,costCalculator:calculateCost,totalCostLimit})