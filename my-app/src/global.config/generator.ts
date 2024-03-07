import {generator as fakeGenerator,costCalculator as fakeCostCalculator} from "../image-generator/fake.generator"

import {generator as  Dalle2Generator,costCalculator as Dalle2CostCalculator} from "../image-generator/dalle-2.generator"

import {generator as  Dalle3Generator,costCalculator as Dalle3CostCalculator} from "../image-generator/dalle-3.generator"
import { ImageCostCalculator, ImageGenerator } from "@/image-generator/generator.interface"

const envName ="GENERATOR"
const envValues = ["dalle-2","dalle-3","fake"] as const 



// DATABASE = "sqlite" # sqlite|postgres-vercel|planetscale
// GENERATOR = "fake" # dalle-2|dalle-3|fake
// TOTAL_COST_LIMIT ="100" # a number 
// USER_TOKENS_GRANTED = "10000" # a number

function setUp(){
   const envValue =  process.env[envName]
   let imageGenerator:ImageGenerator|undefined = undefined
   let costCalculator:ImageCostCalculator|undefined = undefined
   switch(envValue){
    case "dalle-2":
        imageGenerator = Dalle2Generator
        costCalculator = Dalle2CostCalculator
        break;
    case "dalle-3":
        imageGenerator = Dalle3Generator
        costCalculator = Dalle3CostCalculator
        break;
    case "fake":
        imageGenerator = fakeGenerator
        costCalculator = fakeCostCalculator
        break;
   }

   if (imageGenerator ===undefined || costCalculator === undefined){
        throw Error(`
        environment variable ${envName} is not set to a valid string.
        Options are ${["dalle-2","dalle-3","fake"].join(",")}.`)
   }

   return {generate:imageGenerator,calculateCost:costCalculator}
 

}
const {generate,calculateCost} = setUp() 

export {generate,calculateCost}


