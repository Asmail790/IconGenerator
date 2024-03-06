import { OpenAI } from "openai";
import { ImageGenerateParams } from "openai/resources/images.mjs";
import {
  type ImageCostCalculator,
  type ImageGenerator,
} from "./generator.interface";
const openai = new OpenAI();

const generator: ImageGenerator = async (args) => {
  const { prompt, numberOfImages } = args;
  const option: ImageGenerateParams = {
    prompt,
    model: "dall-e-2",
    size: "256x256",
    n: numberOfImages,
    response_format: "url",
  };
  const response = await openai.images.generate(option);
  const urls = response.data.map((img) => {
    if (img.url === undefined) {
      throw Error("Undefined Image url");
    }
    return img.url;
  });

// const urls2 =[`http:localhost:3000/static/fire_thumbnail.png`]

  return urls;
};

const costCalculator: ImageCostCalculator = (numberOfImages: number) =>
  0.016 * numberOfImages;

export { generator, costCalculator };
