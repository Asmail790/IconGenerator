export type ImageGenerator = (args:{prompt:string, numberOfImages:number})=>Promise<string[]>
export type ImageCostCalculator = (numberOfImage:number) => number



