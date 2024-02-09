"use client";

import { usePathname } from "next/navigation";
import { StyledPagination } from "./styled-only-pagination";

type UrlProps = { url: string; page: number }[];



function createPageUrls(args: {
  path:string,
  fixedQuery: Record<string, string|undefined>;
  currentPage: number;
  lastPage: number;
}): UrlProps {
  const { path, fixedQuery,  currentPage, lastPage } = args;

  const queryCommon = new URLSearchParams();

  for (const [key,value] of Object.entries(fixedQuery)) {
    if (value !== undefined){
      queryCommon.append(key,value);
    }
  }

  const pageUrlProps = [-1, 0, 1]
    .map((delta) => {
      const query = new URLSearchParams(queryCommon);
      const page =  currentPage + delta
      query.append("page", String(page));
      const url = `${path}?${query.toString()}`
       

      return { page, url };
    })
    .filter((urlsProps) => 0 <= urlsProps.page && urlsProps.page <= lastPage);

  return pageUrlProps;
}

export function Pagination(props: {args:{
  style?: string;
  description?: string;
  currentPage: number;
  lastPage: number;}}
  ) {

  const {style,description,currentPage,lastPage} =props.args
  const path = usePathname();



  const urlProps = createPageUrls({path,fixedQuery:{style,description},currentPage,lastPage})
  const activeIndex = urlProps.map(urlProp => urlProp.page ).indexOf(currentPage)
  console.log(urlProps)

  if (activeIndex ===-1){
    throw Error("activeIndex undefined")
  }

  return (
    <StyledPagination
      activeIndexInWindow={activeIndex}
      urlPageWindow={urlProps}
      lastPageNumber={lastPage}
    />
  );
}
