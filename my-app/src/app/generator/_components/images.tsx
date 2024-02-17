"use client";
import { useState } from "react";
import { TState } from "../actions/generate-images";
import { TSaveImage } from "../actions/save-image";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Download, Star } from "lucide-react";
import { TStyle } from "@/_constants/styles";

export function Images(props: {
  color: string;
  style: TStyle;
  description: string;
  urls: string[];
  saver: TSaveImage;
}) {
  type URL = string;
  type isSaved = boolean;
  const initialState = Object.fromEntries(
    props.urls.map((url) => [url, false])
  );
  const [saveState, setSaveState] =
    useState<Record<URL, isSaved>>(initialState);

  const style = props.style;
  const color = props.color;
  const description = props.description;
  const alt = `A generated Image with color of ${color}, style of ${style} and description of "${description}".`;
  return (
    <>
      <div className="max-w-2xl flex flex-row gap-5">
        {props.urls.map((url, i) => {
          const urlObj = new URL(url);
          const urlPath = urlObj.pathname;
          return (
            <div className="relative" key={i}>
              <a
                className="absolute top-0 left-0 bg-slate-800 bg-opacity-50 rounded-full p-2 m-2"
                href={urlPath}
                download
              >
                <Download size={20} color="black" />
              </a>
              <div className="absolute top-0 right-0  m-2">
                {saveState[url] === true ? (
                  <Star fill="#e5a50a" size={30} color="#e5a50a" />
                ) : (
                  <Star
                    className="cursor-pointer"
                    size={30}
                    color="#e5a50a"
                    onClick={async () => {
                      const isSaved = await props.saver({
                        url: url,
                        style,
                        color,
                        description,
                      });
                      if (isSaved.successful) {
                        toast("Image Saved");
                        setSaveState({ ...saveState, [url]: true });
                      } else {
                        toast("image could not be saved");
                      }
                    }}
                  />
                )}
              </div>
              <Image width={256} height={256} src={urlPath} alt={alt} />
            </div>
          );
        })}
      </div>
      <Toaster />
    </>
  );
}
