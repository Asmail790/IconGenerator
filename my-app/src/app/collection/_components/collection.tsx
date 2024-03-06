import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Download, Trash } from "lucide-react";
import { Pagination } from "./pagination";
import { deleteImage } from "../_actions/delete-image";
import { Item } from "./item";

type TImageData = {
  description: string;
  style: string;
  url: string;
  color: string;
};

type TPageInfo = {
  currentPage: number;
  lastPage: number;
  searchQuery: {
    style?: string;
    description?: string;
  };
};

type TProp = {
  data: TImageData[];
  pageInfo: TPageInfo;
};

export async function Collection(props: TProp) {
  const images = props.data.map((data, i) => (
      <Item 
      key={i}
      color={data.color}
       style={data.style}
      description={data.description}
      imageUrl={data.url} 
      deleteFunc={deleteImage}
        />
  ));

  const {
    lastPage,
    currentPage,
    searchQuery: { style, description },
  } = props.pageInfo;
  if (props.data.length == 0) {
    const styleCondition = style !== undefined ? ` style=${style}` : "";
    const descriptionCondition =
      description !== undefined ? ` description=${description}` : "";
    const anyCriteria = [style, description].every(Boolean);

    return (
      <div className="m-4 flex flex-row justify-center flex-wrap gap-8">
        <p className="text-3xl">
          No images was found
          {anyCriteria ? "matching the following the criteria:" : ""}
          {styleCondition}
          {descriptionCondition}.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="m-4 flex flex-row justify-center flex-wrap gap-8">
        {images}
      </div>
      <Pagination args={{ style, description, lastPage, currentPage }} />
    </>
  );
}
