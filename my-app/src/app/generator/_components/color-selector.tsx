"use client";
import { buttonVariants } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import ColorPicker2 from "react-pick-color";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Title } from "@/components/ui/title";
import { ColorPicker } from "@mantine/core";
//TODO fix design first button check colorselector.stories.
export default function ColorSelector(props: {
  color: string;
  setColor: (value: string) => void;
}) {
  const { color, setColor } = props;
  return (
    <div>
      <Title>Color</Title>
      <Separator className="my-4" orientation="horizontal" />
        <ColorPicker
          value={color}
          onChangeEnd={setColor}
          fullWidth
          className="w-full"
          swatches={[
            "#2e2e2e",
            "#868e96",
            "#fa5252",
            "#e64980",
            "#be4bdb",
            "#7950f2",
            "#4c6ef5",
            "#228be6",
            "#15aabf",
            "#12b886",
            "#40c057",
            "#82c91e",
            "#fab005",
            "#fd7e14",
          ]}
        />
    </div>
  );
}
