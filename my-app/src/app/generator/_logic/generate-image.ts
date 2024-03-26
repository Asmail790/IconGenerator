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

type DBUtils = Pick<DBInterface,"decreaseToken"|"getNumberOfTokens"|"addToTotalCost"|"getTotalCost">
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
  const { style, color, description, numberOfImages,userId, generator,costCalculator } = args;
  const db = await args.db


  const cost = await db.getTotalCost()
  if ( totalCostLimit<= cost){
    return {isSuccess:false,message:"Request have been denied due to budget constraint."}
  }
  
  
  const userTokens = await db.getNumberOfTokens(userId)
  console.log(userTokens)
  if  ( userTokens  == 0 ){
    return {isSuccess:false,message:"You have no image tokens left."}
  }
  const ImageTokensLeft = userTokens - numberOfImages
  
  if  ( ImageTokensLeft < 0 ){
    return {isSuccess:false,message:`You are short of ${numberOfImages-userTokens} image tokens.`}
  }

  const prompt = `Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}."`;

  const imageUrls = await generator({ numberOfImages, prompt });

  const imageCost = costCalculator(numberOfImages)
  
  await db.decreaseToken({userId,tokensSpend:numberOfImages})
  await db.addToTotalCost(imageCost)
  
  const images = await Promise.all(imageUrls.map( async url => {
    const response = await fetch(url)
    const blob = await response.blob()
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const base64Img = `data:${blob.type};base64,${buffer.toString("base64")}`
    return {base64Img,url}
  }))
  
  
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