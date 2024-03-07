import { ImageCostCalculator, ImageGenerator } from "./generator.interface";
import { OpenAI } from "openai";
import { ImageGenerateParams } from "openai/resources/images.mjs";
const openai = new OpenAI();

export const generator: ImageGenerator = async (args) => {
  const { prompt, numberOfImages } = args;
  const option: ImageGenerateParams = {
    prompt,
    model: "dall-e-3",
    size: "1024x1024",
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

  return urls;
};

export const costCalculator: ImageCostCalculator = (numberOfImages: number) =>
  0.04 * numberOfImages;
