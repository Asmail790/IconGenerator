"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SetStateAction } from "react";


export default function StyleSelector(props: {
    style: string;
    setStyle: (value: SetStateAction<string>) => void;
  }) {
    const { style, setStyle } = props;
  
    const predefinedStyles = [
      "metallic",
      "polygon",
      "pixelated",
      "clay",
      "gradient",
      "flat",
      "illustrated",
    ];
    return (
      <div className="flex flex-col justify-center p-2">
        <label className="text-base text-center" htmlFor="style-options">
          Style
        </label>
        <RadioGroup
          id="style-options"
          className="p-4"
          defaultValue={style}
          onValueChange={(choosenColor) => setStyle(choosenColor)}
        >
          <div className="flex flex-row flex-wrap justify-center gap-8 p-2">
            {predefinedStyles.map((style, id) => (
              <div className="flex flex-col gap-2 items-center justify-center" key={id}>
                <RadioGroupItem
                  value={style}
                  id={`${style}-color`}
                  className={"h-14 w-14 rounded-sm data-[state=checked]:scale-125 hover:scale-110 transition-transform bg-green-900" }
                ></RadioGroupItem>
                <p className="capitalize text-base text-cap text-center">{style}</p>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>
    );
}

