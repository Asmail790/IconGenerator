"use server";
import { z } from "zod";
import { SaveImageStatus, defaultImageSaver as _saveImage } from "../_logic/save-image";
import { defaultGetUserId as getUserId } from "../../api/auth/_logic/get-user-id";
import { getUserEmail } from "../../api/auth/[...nextauth]/config";
import { revalidatePath } from "next/cache";
import { checkPath } from "@/app/_path-register";

const schema = z.object({
  description: z.string(),
  color: z.string(),
  style: z.string(),
  url: z.string(),
});

export async function saveImage(
  invalidatedArgs: z.infer<typeof schema>
): Promise<SaveImageStatus> {
  const { description, color, style, url } = schema.parse(invalidatedArgs);


  const email = await getUserEmail();
  const userId = await getUserId(email);

  const response = await _saveImage({
    color,
    description,
    style,
    url,
    userId,
  });

  revalidatePath(checkPath("/collection/"))

  return response;
}

export type TSaveImage = typeof saveImage;
