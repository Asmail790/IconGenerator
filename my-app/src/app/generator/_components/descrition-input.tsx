import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SetStateAction } from "react";

export default function DescriptionInput(props: {
  description: string;
  maxLength:number
  minLength:number 
  setDescription: (value: string) => void;
}) {
  return (
    <div className="">
      <Label  htmlFor="description">
        Describe your icon
      </Label>
      <Input
      data-testid="description-images"
        maxLength={props.maxLength}
        minLength={props.minLength}
        type="text"
        placeholder="Description"
        id="description"
        value={props.description}
        onChange={(e) => props.setDescription(e.target.value)}
      />
    </div>
  );
}
