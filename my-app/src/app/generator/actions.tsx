"use server";
import "server-only";
import { getUserID } from "../api/auth/[...nextauth]/route";

import { z } from "zod";
import { TGenerateState,defaultImageGenerator as _generateImage  } from "./_logic/generate-image";
import { defaultRequestApprover as isRequestApproved} from "./_logic/is-request-approved"
import { SaveImageStatus,defaultImageSaver as _saveImage } from "./_logic/save-image";


const formDataSchema = z.object({
  style: z.string(),
  color: z.string(),
  description: z.string(),
  numberOfImages: z.coerce.number(),
});

const schema = z
  .instanceof(FormData)
  .transform((formData) => ({
    style: formData.get("style"),
    color: formData.get("color"),
    description: formData.get("description"),
    numberOfImages: formData.get("numberOfImages"),
  }))
  .pipe(formDataSchema);


type ImageProperties = {
  style:string,
  color:string,
  description:string 
}
export type TState = TGenerateState & {imageProperties:ImageProperties};
export async function generateImages(
  _: TState,
  invalidatedFormData: FormData
): Promise<TState> {
  const args = schema.parse(invalidatedFormData);

  const { style, color, description, numberOfImages } = args;
  const userId = await getUserID();
  const status = await isRequestApproved({userId,numberOfImages})
  
  if (!status.isApproved){
    return {
      isSuccess:false,
      messages:status.message,
      imageProperties:{
        style,
        color,
        description,
      }
    }

  }

  const result = _generateImage({
    style,
    color,
    description,
    numberOfImages,
    userId,
  });

  return {... await result, imageProperties:{
    style,
    color,
    description,
  }};
}

export type TGenerateImages = typeof generateImages;



const schema2 = z.object({
  description: z.string(),
  color: z.string(),
  style: z.string(),
  url: z.string(),
});

export async function saveImage(
  invalidatedArgs: z.infer<typeof schema2>
): Promise<SaveImageStatus> {
  const { description, color, style, url } = schema2.parse(invalidatedArgs);
  const userId = await getUserID();
  const response = await _saveImage({
    color,
    description,
    style,
    url,
    userId,
  });

  return response;
}

export type TSaveImage = typeof saveImage;
