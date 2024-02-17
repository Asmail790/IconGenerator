import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetStateAction } from "react";

export default function NumberOfImagesInput(props: {
    numberOfImages: number;
    setNumberOfImages: (value: number) => void;
  }) {
  return (
    <div className="flex flex-col gap-2 justify-center my-4">
      <Label  htmlFor="nbrOfImgs">
        Number of images to generate
      </Label>
      <Input
      value={props.numberOfImages}
      onChange={e => props.setNumberOfImages(Number(e.target.value))}
        type="number"
        min={1}
        max={5}
        id="nbrOfImgs"
      />
    </div>
  );
}
