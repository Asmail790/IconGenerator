import { Input } from "@/components/ui/input";
import { SetStateAction } from "react";

export default function DescriptionInput(props: {
  description: string;
  setDescription: (value: SetStateAction<string>) => void;
}) {
  return (
    <div className="flex flex-col gap-2 justify-center my-4">
      <label className="text-center text-base block w-full" htmlFor="description">
        Describe your icon
      </label>
      <Input
        type="text"
        placeholder="Description"
        className="bg-gray-900 p-2 block w-full"
        id="description"
        value={props.description}
        onChange={(e) => props.setDescription(e.target.value)}
      />
    </div>
  );
}
