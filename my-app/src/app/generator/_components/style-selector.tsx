"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetStateAction } from "react";
import { TStyle, isTStyle, styles } from "../../../_constants/styles";
import { Label } from "@radix-ui/react-label";

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

  return (
    <div className="flex flex-col justify-center p-2">
      <Label htmlFor="style-options">Style</Label>
      <RadioGroup
        id="style-options"
        value={style}
        onValueChange={onValueChange}
      >
        <div className="flex flex-row flex-wrap gap-8 py-4">
          {styles.map((style, id) => (
            <div
              className="flex flex-col gap-2 items-center justify-center"
              key={id}
            >
              <RadioGroupItem
                value={style}
                id={`${style}-color`}
                className={
                  "h-14 w-14 rounded-sm data-[state=checked]:border-gray-300 data-[state=checked]:border-2 data-[state=checked]:scale-125 hover:scale-110 transition-transform bg-green-900"
                }
              ></RadioGroupItem>
              <p className="capitalize text-base text-cap text-center">
                {style}
              </p>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}
