"use server";
import "server-only";

import { z } from "zod";
import { TGenerateState,defaultImageGenerator as _generateImage  } from "../_logic/generate-image";
import { defaultRequestApprover as isRequestApproved} from "../_logic/is-request-approved"
import {defaultGetUserId as  getUserId} from "../../api/auth/_logic/get-user-id"
import { getUserEmail } from "../../api/auth/[...nextauth]/config";
import { defaultImageTokenGetter as getImageTokens } from "../_logic/get-number-of-tokens";
import {defaultTotalCostGetter as getTotalCost} from "../_logic/get-total-cost"

const argsSchema = z.object({
  style: z.string(),
  color: z.string(),
  description: z.string(),
  numberOfImages: z.number(),
});



export type TState = TGenerateState 
export async function generateImages(
  invalidatedArgs:{style:string, color:string, description:string, numberOfImages:number}
): Promise<TState> {
  const { style, color, description, numberOfImages } = argsSchema.parse(invalidatedArgs);
  
  const email = await getUserEmail();
  const userId = await getUserId(email)
  
  const currentImageTokens = await getImageTokens(userId)
  const currentTotalCost = await getTotalCost()

  const status = isRequestApproved({currentUserTokens: currentImageTokens,numberOfImages,currentTotalCost})
  
  if (!status.isApproved){
    return {
      isSuccess:false,
      message:status.message,
    }

  }

  const result = await _generateImage({
    style,
    color,
    description,
    numberOfImages,
    userId,
  });

  
  return result;
}

export type TGenerateImages = typeof generateImages;




