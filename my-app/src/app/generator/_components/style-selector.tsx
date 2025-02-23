"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetStateAction } from "react";
import { TStyle, isTStyle, styles } from "../../../_constants/styles";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";
import Image from "next/image";
export default function StyleSelector(props: {
  style: TStyle;
  setStyle: (value: TStyle) => void;
}) {
  const { style, setStyle } = props;

  const onValueChange = (newStyle: string) => {
    if (!isTStyle(newStyle)) {
      throw Error(`"${newStyle}" is not valid style`);
    }
    setStyle(newStyle);
  };

  const possibleStyles: TStyle[] = [
    "illustrated",
    "metallic",
    "pixelated",
    "polygonic",
    "flat",
  ];

  const icons = possibleStyles.map((item) => `url('/example/${item}.jpeg')`);

  return (
    <div className="flex flex-col justify-center">
      <Title>Style</Title>
      <Separator className="my-4" orientation="horizontal" />
      <RadioGroup
        data-testid="style-group"
        id="style-options"
        value={"illustrated" satisfies TStyle}
        onValueChange={onValueChange}
      >
        <div className="flex flex-row flex-wrap gap-1 justify-center sm:justify-start">
          <div
            className="flex flex-col gap-2 items-center justify-center"
          >
            <RadioGroupItem
              value={"illustrated" satisfies TStyle}
              className={`h-24 w-24  bg-contain  rounded-sm bg-[url('/example/illustrated.jpeg')] data-[state=checked]:ring-white data-[state=checked]:ring-2 data-[state=checked]:scale-90 transition-transform bg-green-900`}
            />
            <p className="capitalize text-base text-cap text-center">{"illustrated" satisfies TStyle}</p>
          </div>

          <div
            className="flex flex-col gap-2 items-center justify-center"
          >
            <RadioGroupItem
              value={"metallic" satisfies TStyle}
              className={`h-24 w-24  bg-contain  rounded-sm bg-[url('/example/metallic.jpeg')] data-[state=checked]:ring-white data-[state=checked]:ring-2 data-[state=checked]:scale-90 transition-transform bg-green-900`}
            />
            <p className="capitalize text-base text-cap text-center">{"metallic" satisfies TStyle}</p>
          </div>


          <div
            className="flex flex-col gap-2 items-center justify-center"
          >
            <RadioGroupItem
              value={"pixelated" satisfies TStyle}
              id={`${style}-color`}
              className={`h-24 w-24  bg-contain  rounded-sm bg-[url('/example/pixelated.jpeg')]  data-[state=checked]:ring-white data-[state=checked]:ring-2 data-[state=checked]:scale-90 transition-transform bg-green-900`}
            />
            <p className="capitalize text-base text-cap text-center">{"pixelated" satisfies TStyle}</p>
          </div>


          <div
            className="flex flex-col gap-2 items-center justify-center"
          >
            <RadioGroupItem
              value={"polygonic" satisfies TStyle}
              className={`h-24 w-24  bg-contain  rounded-sm bg-[url('/example/polygonic.jpeg')]  data-[state=checked]:ring-white data-[state=checked]:ring-2 data-[state=checked]:scale-90 transition-transform bg-green-900`}
            />
            <p className="capitalize text-base text-cap text-center">{"polygonic" satisfies TStyle}</p>
          </div>


          <div
            className="flex flex-col gap-2 items-center justify-center"
          >
            <RadioGroupItem
              value={"flat" satisfies TStyle}
              className={`h-24 w-24  bg-contain  rounded-sm bg-[url('/example/flat.jpeg')]  data-[state=checked]:ring-white data-[state=checked]:ring-2 data-[state=checked]:scale-90 transition-transform bg-green-900`}
            />
            <p className="capitalize text-base text-cap text-center">{"flat" satisfies TStyle}</p>
          </div>
          
        </div>
      </RadioGroup>

      
    </div>
  );
}
