import { defaultGetImages as getImages } from "@/app/collection/_logic/get-images";
import { getUserEmail } from "../auth/[...nextauth]/config";
import { defaultGetUserId as getUserId } from "../auth/_logic/get-user-id";
import { querySchema } from "@/app/collection/_shared/schema";
import { z } from "zod";
type TSearchParams = { imageID: string };

export const imageDataSchema = z.object({
    lastPage:z.number(),
    imageData:z.array(z.object({
        description: z.string(),
        style: z.string(),
        url: z.string(),
        color: z.string()
    }))

})
export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.entries()
  const { style, description, page, pageSize } = querySchema.parse(
    Object.fromEntries(query)
  );

  const email = await getUserEmail();
  const userId = await getUserId(email);

  const { imageData, lastPage } = await getImages({
    userId,
    style,
    description,
    pageIndex: page,
    pageSize,
  });

  return  Response.json({ imageData, lastPage })

}
