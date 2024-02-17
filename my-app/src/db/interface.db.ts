
// Todo support batch and transaction
// transaction need for decreaseTokenByOne addToTotalCost getTotalCost
// return state success or failure instead of error


type ImageProps = {color:string,style:string,description:string,id:string}
export default interface IDB {

    getNumberOfTokens(userId:string):Promise<number>
    
    getImageIds(args:{
        userId:string,
        description?:string,
        color?:string,
        style?:string,
        offset:number,
        limit:number
    }):Promise<string[]>

    totalNumberOfImages(args:{
        userId:string,
        description?:string,
        color?:string,
        style?:string,
        offset:number,
        limit:number
    }):Promise<number>

    getUserId(email:string):Promise<string>

    getImageProperties(args:{
        userId:string,
        imageIds:string[]
    }):Promise<ImageProps[]>


    
    getTotalCost():Promise<number>

    getImageData(args:{
        userId:string,
        imageId:string
        }
    ):Promise<Buffer>

    saveImage(args:{
        userId:string,
        data:Buffer,
        description:string,
        color:string,
        style:string
    }):Promise<void>


    removeImage(imageId:string,userId:string):Promise<void>
    
    createTokens(userId:string,numberOfTokens:number):Promise<void>
    decreaseToken(args:{userId: string,tokensSpend:number}):Promise<void>

    addToTotalCost(cost:number):Promise<void>
}



