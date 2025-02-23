import {
  ImageCostCalculator,
  ImageGenerator,
} from "@/image-generator/generator.interface";
import { promiseDB } from "@/global.config/db";
import { calculateCost, generate } from "@/global.config/generator";
import { totalCostLimit } from "@/global.config/totalCostLimit";
import { DBInterface } from "@/db/interface";
import { TStyle } from "@/_constants/styles";



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
  style: TStyle;
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

  let prompt = `Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}."`;

  if (style==="metallic"){
    prompt=`Metallic icons, whether in digital design or physical art, are characterized by their visual simulation of metal. They employ techniques like highlights, shadows, and textures to mimic reflectivity and material grain, creating a sense of depth and realism. Colors range from traditional silvers and golds to iridescent hues. In digital interfaces, they convey sophistication and durability, while in religious art, they add preciousness and protection. Physical metallic icons utilize materials like gold, silver, and copper, crafted with techniques like repoussé and engraving. Essentially, the core characteristic is the visual representation of metallic properties, enhancing the icon's aesthetic and symbolic meaning.
    Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}.
    `
  } else if (style ==="polygonic") {
    prompt=`Polygonic icons are defined by their construction from straight line segments, creating a range of geometric shapes from simple triangles to complex multi-sided figures. This inherent geometric nature lends them a sense of precision, structure, and modernity, making them well-suited for representing concepts related to technology, engineering, and data. Their versatility allows for use in various design styles, from minimalist to 3D-rendered, and different polygonal shapes can evoke specific symbolic meanings, such as stability or dynamism. Technically, these icons are often created as scalable vector graphics, and in applications like GIS, they are constructed with symbol layers for customizable visual properties.
    Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}.
    `
  } else if (style==="pixelated"){
    prompt=`A pixelated icon is defined by its visibly blocky structure, a result of being constructed from individual, discrete pixels within a low-resolution grid. This characteristic creates a distinct retro aesthetic, often reminiscent of early digital graphics and video games, where simplified details and limited color palettes are common. While intentional pixelation is a stylistic choice, it also arises from scaling low-resolution images, leading to a loss of clarity. Unlike vector graphics, pixelated icons have limitations in scalability, as enlargement emphasizes their blocky nature. Essentially, a pixelated icon embraces the fundamental building blocks of digital images, transforming them into a recognizable and often nostalgic visual form.
    Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}.
    `
  } else if (style==="flat") {
    prompt=`Flat icons are defined by their commitment to minimalism and simplicity, discarding 3D effects for clean, two-dimensional designs. They rely heavily on solid colors and basic geometric shapes, prioritizing clarity and immediate recognition, especially at varying sizes. This design philosophy emphasizes functionality, ensuring icons efficiently convey their purpose in a universally understandable way. The resulting aesthetic is modern and uncluttered, aligning with contemporary user interface trends that favor straightforward and efficient visual communication.
    Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}.
    `
  } else if (style==="illustrated"){
    prompt =`Illustrated icons prioritize artistic expression and detailed visual storytelling, setting them apart from simpler flat icons. They are characterized by a distinct artistic style, incorporating elements like shading, texture, and perspective to create depth and personality. This allows for intricate details and complex representations, conveying nuanced meanings and fostering an emotional connection with users. Illustrated icons utilize varied techniques, from digital drawing to 3D rendering, offering a wide range of visual styles. While scalability might be slightly less rigid than with vector-based flat icons, illustrated icons excel at adding character and narrative to designs, making them more engaging and memorable.
    Generate an icon styled as ${style}, with primary color of "${color}" and that fit following description:"${description}.
    `
  }

  let imageUrls=[]
  try {
    imageUrls = await generator({ numberOfImages, prompt });

  } catch(error){
    return {"isSuccess":false,message:"Image generation endpoint is changed."}
  }

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
    style: TStyle;
    color: string;
    description: string;
    userId: string;
    numberOfImages: number;
  }) => generateImage({ ...requestArgs, ...config });
}

export const defaultImageGenerator = createImageGenerator({db:promiseDB,generator:generate,costCalculator:calculateCost,totalCostLimit})