import ImageGeneratorForm from "./_components/image-generator-form";
import { generateImages } from "./_actions/generate-images";
import { saveImage } from "./_actions/save-image";
import { defaultImageTokenGetter as getImageToken } from "./_logic/get-number-of-tokens";
import { defaultGetUserId as getUserId } from "../api/auth/_logic/get-user-id";
import { getUserEmail, isLoggedIn } from "../api/auth/[...nextauth]/config";
import { userTokensGranted } from "@/global.config/userTokensGranted";



 async function getTokens(){
  const email = await getUserEmail()
  const userId = await getUserId(email)
  const tokens =  await getImageToken(userId)
  return tokens
}

export default async function Generator() {

  // if (!await isLoggedIn()){
  //  return <SignInRequest message="To generate icons you need to sign in."/>
  // }

  const tokens = await isLoggedIn()? await getTokens():userTokensGranted
  

  return (
      <ImageGeneratorForm imageGenerator={generateImages} numberOfImageTokens={tokens} imageSaver={saveImage} />
  );
}
