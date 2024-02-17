import { eq } from "drizzle-orm";
import { icons, users } from "../../../../../schema";
import { db } from "@/global.config/db";
import { defaultImageGetter as getImage } from "./_logic/get-image";
import { auth, getUserEmail } from "../../auth/[...nextauth]/config";
import { defaultGetUserId as getUserId } from "../../auth/_logic/get-user-id";

type TSearchParams = { imageID: string };
export async function GET(
  request: Request,
  { params }: { params: TSearchParams }
) {
  const imageId = params.imageID;
  const email = await getUserEmail();
  const userId = await getUserId(email);

  const image = await getImage({ userId, imageId });
  return new Response(image, {
    headers: new Headers({ "Content-Type": "image/png" }),
  });
}


