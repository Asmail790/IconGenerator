"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetStateAction } from "react";
import { TStyle, isTStyle, styles } from "../../../_constants/styles";
import { Label } from "@radix-ui/react-label";
import { Separator } from "@/components/ui/separator";
import { Title } from "@/components/ui/title";

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
    <div className="flex flex-col justify-center">
      <Title>Style</Title>
      <Separator className="my-4" orientation="horizontal" />
      <RadioGroup
        data-testid="style-group"
        id="style-options"
        value={style}
        onValueChange={onValueChange}
      >
        <div className="flex flex-row flex-wrap gap-1 justify-center sm:justify-start">
          {styles.map((style, id) => (
            <div
              className="flex flex-col gap-2 items-center justify-center"
              key={id}
            >
              <RadioGroupItem
                value={style}
                id={`${style}-color`}
                className={
                  "h-24 w-24 rounded-sm data-[state=checked]:ring-gray-600 data-[state=checked]:ring-2 data-[state=checked]:scale-90 hover:scale-110 transition-transform bg-green-900"
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
