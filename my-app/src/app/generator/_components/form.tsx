"use client";
import { useState } from "react";
import { useFormState } from "react-dom";
import { TGenerateImages, TSaveImage, TState } from "../actions";
import { Button } from "@/components/ui/button";

import ColorSelector from "./color-selector";
import StyleSelector from "./style-selector";
import DescriptionInput from "./descrition-input";
import NumberOfImagesInput from "./number-of-images-input";
import Image from "next/image";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Download } from "lucide-react";

type TGeneratorFormProps = {
  imageGenerator: TGenerateImages;
  imageSaver: TSaveImage;
};

export default function GeneratorForm(props: TGeneratorFormProps) {
  const { imageGenerator, imageSaver } = props;

  const [state, formAction] = useFormState(imageGenerator, {
    isSuccess: true,
    imageUrls: [],
    imageProperties: {
      description: "",
      color: "black",
      style: "metallic",
    },
  });

  const [color, setColor] = useState(state.imageProperties.color);
  const [style, setStyle] = useState(state.imageProperties.style);
  const [description, setDescription] = useState(
    state.imageProperties.description
  );
  const [numberOfImages, setNumberOfImages] = useState(1);

  return (
    <div className="flex flex-col justify-center">
      <form action={formAction}>
        <input type="text" name="color" value={color} hidden />
        <input type="text" name="style" value={style} hidden />
        <input type="text" name="description" value={description} hidden />
        <input
          type="number"
          name="numberOfImages"
          value={numberOfImages}
          hidden
        />

        <ColorSelector color={color} setColor={setColor} />
        <StyleSelector style={style} setStyle={setStyle} />
        <DescriptionInput
          description={description}
          setDescription={setDescription}
        />
        <NumberOfImagesInput
          numberOfImages={numberOfImages}
          setNumberOfImages={setNumberOfImages}
        />
        <Button className="my-4" type="submit">
          generate images
        </Button>
      </form>

      <Images state={state} saver={imageSaver} />
    </div>
  );
}

export const Images = (props: { state: TState; saver: TSaveImage }) => {
  if (props.state.isSuccess) {
    const { style, color, description } = props.state.imageProperties;
    const alt = `A generated Image with color of ${color}, style of ${style} and description of "${description}".`;
    return (
      <div className="flex flex-row gap-5">
        {props.state.imageUrls.map((url) => (
            <div className="relative" key={url}>
              <a
                className="absolute top-0 left-0 bg-slate-800 bg-opacity-50 rounded-full p-2 m-2"
                href={url}
                download
              >
                <Download size={20} color="black" />
              </a>
              <Image width={256} height={256} src={url} alt={alt} />
            <Button
            className="m-auto"
              variant="outline"
              onClick={async () => {
                const isSaved = await props.saver({
                  url,
                  style,
                  color,
                  description,
                });
                if (isSaved.successful) {
                  toast("Image Saved");
                } else {
                  toast("image could not be saved");
                }
              }}
            >
              Save image
            </Button>
            </div>
        ))}
        <Toaster />
      </div>
    );
  }

  return <div>{props.state.messages}</div>;
};
