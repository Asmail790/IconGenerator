type URL=string

export type ImageGenerator = (args:{prompt:string, numberOfImages:number})=>Promise<URL[]>
export type ImageCostCalculator = (numberOfImage:number) => number



