import IDB from "./interface.db";

 
export default class mySQL implements IDB{
    removeImage(imageId: string,userId:string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    totalNumberOfImages(args: { userId: string; description?: string | undefined; color?: string | undefined; style?: string | undefined; offset: number; limit: number; }): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getUserId(email: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    createTokens(userId: string, numberOfTokens: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getImageProperties(args: { userId: string; imageIds: string[]; }): Promise<{ color: string; style: string; description: string; id: string; }[]> {
        throw new Error("Method not implemented.");
    }
    getNumberOfTokens(userId: string): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getImageIds(args: { userId: string; description?: string | undefined; color?: string | undefined; style?: string | undefined; offset: number; limit: number; }): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    getTotalCost(): Promise<number> {
        throw new Error("Method not implemented.");
    }
    getImageData(args: { userId: string; imageId: string; }): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    saveImage(args: { userId: string; data: Buffer; description: string; color: string; style: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    decreaseToken(args:{userId: string,tokensSpend:number}): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addToTotalCost(cost: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
   
   
}