import { Collection } from "./_components/collection";
import { SearchForm } from "./_components/search-form";
import { search } from "./_actions/search";
import { querySchema } from "./_shared/schema";
import { getUserEmail, isLoggedIn } from "../api/auth/[...nextauth]/config";
import { defaultGetUserId as getUserId } from "../api/auth/_logic/get-user-id";
import { defaultGetImages as getImages } from "@/app/collection/_logic/get-images";
import { SignInRequest } from "../home/_components/sign-message";



export default async function CollectionPage(props:{ searchParams: Record<string,string>}) {

  
  if (!await isLoggedIn()){
    return <SignInRequest message="To see your collection you need to sign in."/>
  }
  
  const {style,description,page,pageSize} = querySchema.parse(props.searchParams)

  const email = await getUserEmail();
  const userId = await getUserId(email);


  const {imageData,lastPage} = await getImages({userId,style,description,pageIndex:page,pageSize})
  const pageInfo = {currentPage:page, lastPage,searchQuery:{style,description}}
  return (<>
  <SearchForm args={{style,description,search}}/>
  <Collection data={imageData} pageInfo={pageInfo} />
  </>)
}






