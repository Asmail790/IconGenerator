import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NumberOfImagesInput(props: {
    numberOfImages: number;
    setNumberOfImages: (value: number) => void;
  }) {
  return (
    <div>
      <Label  htmlFor="nbrOfImgs">
        Number of images to generate
      </Label>
      <Input
      data-testid="nbr-of-images"
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
