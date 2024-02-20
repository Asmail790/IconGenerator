"use client";
import { buttonVariants } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import ColorPicker from "react-pick-color";
import { predefinedColors } from "../../../_constants/colors";
import { Input } from "@/components/ui/input";

//TODO fix design first button check colorselector.stories.
export default function ColorSelector(props: {
  color: string;
  setColor:(value: string) => void;
}) {
  const { color, setColor } = props;


  const tabsTriggers = [
    ["Predefined color", "predefined-color"] as const,
    ["Color picker", "color-picker"] as const,
    ["Custom color", "custom"] as const,
  ].map(([text, value]) => (
    <TabsTrigger
      key={value}
      value={value}
      className={cn(
        "text-white capitalize p-2 self-center bg-slate-800 data-[state=active]:bg-slate-800 flex-1",
        buttonVariants({ variant: "outline" })
      )}
    >
      {text}
    </TabsTrigger>
  ));

  return (
    <>
      <Tabs defaultValue="predefined-color">
        <TabsList className="flex flex-row justify-between gap-4 flex-wrap">
          {tabsTriggers}
        </TabsList>

        <TabsContent
          className="py-4"
          value="predefined-color"
        >
         
          <RadioGroup
            value={color}
            onValueChange={(chosenColor) => setColor(chosenColor)}
          >
            <div className="flex flex-row flex-wrap gap-8">
              {predefinedColors.map((color, id) => (
                  <RadioGroupItem
                    key={id}
                    value={color}
                    id={`${color}-color`}
                    className="h-14 w-14 rounded-sm data-[state=checked]:scale-125 data-[state=checked]:border-gray-300 data-[state=checked]:border-2 hover:scale-110 transition-transform"
                    style={{background:color}}
                    
                  />
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
            theme={{ background: "rgb(2,6,23)", borderColor: "rgb(2,6,23)" }}
            className="m-4"
          />
        </TabsContent>
        <TabsContent className="flex flex-col gap-4 py-4" value="custom">
          <div className="flex flex-row gap-3 items-center">
            <Input
              id="custom-color"
              type="text"
              placeholder="Hex-code such as #FF0000 or rgb such as rgb(255,0,0) or by name such as red"
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
