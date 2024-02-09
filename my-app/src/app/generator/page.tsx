import GeneratorForm from "./_components/form";
import { generateImages, saveImage } from "./actions";

export default function Generator() {
  return (
      <GeneratorForm imageGenerator={generateImages} imageSaver={saveImage} />
  );
}
