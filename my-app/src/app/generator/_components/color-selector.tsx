"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { SetStateAction, useEffect } from "react";
import ColorPicker from "react-pick-color";

//TODO fix design first button check colorselector.stories.
export default function ColorSelector(props: {
  color: string;
  setColor: (value: SetStateAction<string>) => void;
}) {
  const { color, setColor } = props;

  const predefinedColors = [
    "bg-neutral-800",
    "bg-red-700",
    "bg-orange-800",
    "bg-yellow-800",
    "bg-cyan-900",
    "bg-emerald-900",
  ];

  const tabsTriggers = [
    ["Predefined colors", "predefined-colors"] as const,
    ["Color picker", "color-picker"] as const,
    ["Custom color", "custom"] as const,
  ].map(([text, value]) => (
    <TabsTrigger
      key={value}
      value={value}
      className=" 
  text-base
  text-center
  cursor-pointer 
  p-1
  m-2
  transition-colors
  rounded-lg
  data-[state=active]:bg-slate-600"
    >
      {text}
    </TabsTrigger>
  ));

  return (
    <>
      <Tabs defaultValue="predefined-colors" className="">
        <TabsList className="flex flex-row justify-between gap-10 bg-slate-900 rounded-lg">
          {tabsTriggers}
        </TabsList>

        <TabsContent
          className="flex flex-col align-middle"
          value="predefined-colors"
        >
          <p className="text-base p-4 text-center">
            Choose a predefined color.
          </p>
          <RadioGroup
            defaultValue={color}
            onValueChange={(chosenColor) => setColor(chosenColor)}
          >
            <div className="flex flex-row justify-center flex-wrap gap-8 p-2">
              {predefinedColors.map((color, id) => (
                <div  className="flex flex-col items-center gap-2">
                  <RadioGroupItem
                    value={color}
                    id={`${color}-color`}
                    key={id}
                    className={cn(
                      "h-14 w-14 rounded-sm data-[state=checked]:scale-125 hover:scale-110 transition-transform",
                      color
                    )}
                  />
                  <p className="capitalize text-base text-cap text-center">{color}</p>
                </div>
              ))}
            </div>
          </RadioGroup>
        </TabsContent>
        <TabsContent
          className="flex flex-row justify-center"
          value="color-picker"
        >
          <ColorPicker
            color={color}
            onChange={(color) => setColor(color.hex)}
            hideAlpha
            hideInputs
            theme={{ background: "rgb(2 6 23)", borderColor: "rgb(30 41 59)" }}
            className="m-4"
          />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 py-4" value="custom">
          <label htmlFor="custom-color" className="text-center text-base">
            Hex-color
          </label>
          <div className="flex flex-row gap-3 items-center">
            <input
              id="custom-color"
              className="text-base  grow text-in caret-inherit bg-gray-900 p-2"
              type="text"
              onChange={(e) => setColor(e.target.value)}
              value={color}
            />
            <div
              className="self-stretch aspect-square rounded-md"
              style={{ backgroundColor: color }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
