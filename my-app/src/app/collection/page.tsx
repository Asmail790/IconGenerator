"use server"
import { Collection } from "./_components/collection";
import fire_image from "../../../public/fire_thumbnail.png";
import ok_thumbnail from "../../../public/ok_thumbnail.png";
import { auth, getUserID } from "../api/auth/[...nextauth]/route";
import { SignMessage } from "./_components/message";
import { signIn } from "next-auth/react";
import IDB from "@/db/interface.db";
import { usePathname, useSearchParams } from "next/navigation";
import { Pagination } from "./_components/pagination";
import { z } from "zod";
import { db } from "@/global.config/db";
import { headers } from "next/headers";
import { SearchForm } from "./_components/search-form";
import { search } from "./actions/search";
import { defaultGetImages as getImages } from "./actions/get-images";


const schema = z.object({
  style:z.string().optional(),
  description:z.string().optional(),
  pageIndex:z.coerce.number().default(0),
  pageSize:z.coerce.number().default(10),
})



export default async function CollectionPage(props:{ searchParams: Record<string,string>}) {

  const {style,description,pageIndex,pageSize} = schema.parse(props.searchParams)

  
  
  
  const session = await auth();
  
  
  
  const email = session?.user?.email
  if (email ===undefined || email===null ) {
    return <SignMessage signIn={signIn} />;
  }
  
  
  const userId = await db.getUserId(email)
  const {imageData,lastPage} = await getImages({userId,style,description,pageIndex,pageSize})
  const pageInfo = {currentPage:pageIndex, lastPage,searchQuery:{style,description}}
  return (<>
  <SearchForm args={{style,description,search}}/>
  <Collection data={imageData} pageInfo={pageInfo} />
  </>)
}






