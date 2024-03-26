"use server";
import "server-only";

import { z } from "zod";
import { TGenerateState,defaultImageGenerator as _generateImage  } from "../_logic/generate-image";
import {defaultGetUserId as  getUserId} from "../../api/auth/_logic/get-user-id"
import { getUserEmail } from "../../api/auth/[...nextauth]/config";
import rateLimiter from "@/lib/rate-limt";
import { NextResponse } from "next/server";
import { rateLimit } from "@/global.config/rate.limit";
import { notFound, redirect } from "next/navigation";

const argsSchema = z.object({
  style: z.string(),
  color: z.string(),
  description: z.string(),
  numberOfImages: z.number(),
});

const limiter = rateLimiter({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 50, // Max 50 users per second
});



export type TState = TGenerateState 
export async function generateImages(
  invalidatedArgs:{style:string, color:string, description:string, numberOfImages:number}
): Promise<TState> {

  let response = NextResponse.next()
  try {
    await limiter.check(response, rateLimit, "CACHE_TOKEN"); // 10 requests per minute
  } catch {

    notFound()
    //return {isSuccess:false,message:"To many request send in short period. Please wait atleast a minute to send request again."}
  }

  const { style, color, description, numberOfImages } = argsSchema.parse(invalidatedArgs);
  
  const email = await getUserEmail();
  const userId = await getUserId(email)

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




