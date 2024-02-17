import { ImageGenerator,ImageCostCalculator } from "./generator.interface";
import fire_thumbnail from "../../public/fire_thumbnail.png"
import ok_thumbnail from "../../public/ok_thumbnail.png"


export function createFakeGenerator(urls: string[], cost: number) {

  const generator:ImageGenerator =  async function (args: { prompt: string; numberOfImages: number }) {
      const { numberOfImages } = args;
      const selectedUrls = Array(numberOfImages)
        .fill(null)
        .map(() => Math.floor(Math.random() * urls.length))
        .map((i) => {
          const url = urls[i]
            if (url === undefined) {
            throw Error("IndexError")
        }

        return url
    
    });
      return selectedUrls;
    }

    const costCalculator:ImageCostCalculator = (nbrOfImage:number) => cost*nbrOfImage

  return {costCalculator,generator}
}



const publicImages = ["fire_thumbnail.png","ok_thumbnail.png"]
const port = process.env.PORT
const urls = publicImages.map(imageFileName => `http:localhost:${port}/static/${imageFileName}`)
const cost = 0.01

const {costCalculator, generator} = createFakeGenerator(urls,cost)


export  {costCalculator,generator}

