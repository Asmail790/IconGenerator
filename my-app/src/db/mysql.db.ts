import IDB from "./interface.db";

 
export default class mySQL implements IDB{
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
    decreaseTokenByOne(userId: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addToTotalCost(cost: number): Promise<void> {
        throw new Error("Method not implemented.");
    }
   
   
}