import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download, Trash } from "lucide-react";
import { Pagination } from "./pagination";
import { deleteImage } from "../_actions/delete-image";


type TImageData = {
  description: string;
  style: string;
  url: string;
  color: string;
};

type TPageInfo = {
  currentPage:number,
  lastPage:number
  searchQuery:{
    style?:string,
    description?:string
  }
}

type TProp = {
  data: TImageData[],
  pageInfo:TPageInfo,
} 



export async function Collection(props:  TProp ) {
  const images = props.data.map((data,i) => (
    <Popover key={i}>
      <PopoverTrigger>
        <div className="relative">
          <a
            className="absolute top-0 left-0 bg-slate-800 bg-opacity-90 rounded-full p-2 m-2"
            href={data.url}
            download
          >
            <Download  size={20} color="white" />
          </a>

          <form action={deleteImage} className="absolute bg-slate-800 bg-opacity-90 top-0 right-0 p-2 m-2 rounded-full">
            <input type="text" readOnly hidden value={data.url} name="url"/>
            <input type="submit" value="delete"/>
          </form>
          <Image src={data.url} alt="image" width={256} height={256} />
          <p>{data.description}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div>{data.description}</div>
        <div>
          <span className="font-bold  text-zinc-600">color</span> : {data.color}
        </div>
        <div>
          <span className="font-bold text-zinc-600">style</span> : {data.style}
        </div>
      </PopoverContent>
    </Popover>
  ));


  const {lastPage,currentPage,searchQuery:{style,description}} = props.pageInfo
  if (props.data.length ==0){
    const styleCondition = style!==undefined?` style=${style}`:""
    const descriptionCondition = description!==undefined?` description=${description}`:""
    const anyCriteria = [style,description].every(Boolean)

    return  <div className="m-4 flex flex-row justify-center flex-wrap gap-8"><p
    className="text-3xl">
      No images was found{anyCriteria? "matching the following the criteria:":""}{styleCondition}{descriptionCondition}.
      </p></div>
  }

  return (
    <>
    <div className="m-4 flex flex-row justify-center flex-wrap gap-8">
      {images}
    </div>
    <Pagination args={{style,description,lastPage,currentPage}}/>
    </>
  )
}
