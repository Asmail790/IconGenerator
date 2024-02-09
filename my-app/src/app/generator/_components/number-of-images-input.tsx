import { SetStateAction } from "react";

export default function NumberOfImagesInput(props: {
    numberOfImages: number;
    setNumberOfImages: (value: SetStateAction<number>) => void;
  }) {
  return (
    <div className="flex flex-col gap-2 justify-center my-4">
      <label className="text-center text-base block w-full" htmlFor="nbrOfImgs">
        Number of images to generate
      </label>
      <input
      value={props.numberOfImages}
      onChange={e => props.setNumberOfImages(Number(e.target.value))}
        className="bg-gray-900 block p-2  w-full"
        type="number"
        min={1}
        max={5}
        id="nbrOfImgs"
      />
    </div>
  );
}
