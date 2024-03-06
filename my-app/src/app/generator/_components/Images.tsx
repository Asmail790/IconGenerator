"use client";
import { useEffect,  useState } from "react";
import { TSaveImage } from "../_actions/save-image";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Download, Star } from "lucide-react";
import { TStyle } from "@/_constants/styles";

import NextJsImage from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function Images(props: {
  color: string;
  style: TStyle;
  description: string;
  images: { url: string; base64Img: string }[];
  saver: TSaveImage;
}) {
  const style = props.style;
  const color = props.color;
  const description = props.description;
  const saver = props.saver;
  return (
    <>
      <div className="max-w-2xl flex flex-row gap-5">
        {props.images.map((image, i) => (
          <ImageFrame
            key={i}
            image={image}
            saver={saver}
            color={color}
            description={description}
            style={style}
          />
        ))}
      </div>
      <Toaster />
    </>
  );
}

function ImageFrame(props: {
  image: {
    url: string;
    base64Img: string;
  };
  style: string;
  color: string;
  description: string;
  saver: TSaveImage;
}) {
  const {
    image: { url, base64Img },
    style,
    color,
    description,
    saver,
  } = props;

  // const urlObj = new URL(url);
  // const correctUrl =
  //   urlObj.hostname === "localhost" ? urlObj.pathname : urlObj.href;
  const alt = `A generated Image with color of ${color}, style of ${style} and description of "${description}".`;
  return (
    <Card>
      <CardContent className="px-0 my-0">
        <NextJsImage width={256} height={256} src={url} alt={alt} />
      </CardContent>
      <CardFooter className="px-4  flex flex-row mx-auto justify-between gap-4">
        <a
          href={base64Img}
          download
          className={buttonVariants({ variant: "outline" })}
        >
          <Download size={20} />
        </a>
        <SaveButton {...{ url, style, color, description, saver }} />
      </CardFooter>
    </Card>
  );
}



function SaveButton(props: {
  url: string;
  style: string;
  color: string;
  description: string,
  saver: TSaveImage;
}) {

  const { url, style, color, description, saver } = props;
  //TODO use optimistic update hook instead of "saving"!
  const [state, setState] = useState<"saved" | "notSaved" | "saving">(
    "notSaved"
  );

  useEffect(()=>{setState("notSaved")},[props.url])


  async function save() {
    const isSaved = await saver({
      url,
      style,
      color,
      description,
    });
    setState("saving");
    if (isSaved.successful) {
      toast("Image Saved");
      setState("saved");
    } else {
    setState("notSaved");
    toast(isSaved.message);
     }
  }

  const starColor = "#e5a50a";
  return (
    <Button
      variant="outline"
      disabled={state == "saved" || state == "saving"}
      onClick={save}
    >
      <Star
        size={20}
        color={starColor}
        className={state === "saving" ? "animate-pulse" : undefined}
        fill={state == "saved" || state == "saving" ? starColor : undefined}
      />
    </Button>
  );
}