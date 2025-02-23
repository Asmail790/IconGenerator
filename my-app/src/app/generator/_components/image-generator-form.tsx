"use client";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { TGenerateImages } from "../_actions/generate-images";
import { TSaveImage } from "../_actions/save-image";

import ColorSelector from "./color-selector";
import StyleSelector from "./style-selector";
import DescriptionInput from "./descrition-input";
import NumberOfImagesInput from "./number-of-images-input";
import { AlertInfo } from "./alert-info";
import { Images } from "./Images";
import { SubmitButton } from "./submit-button";
import { TStyle, isTStyle, styles } from "../../../_constants/styles";
import { toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { Title } from "@/components/ui/title";
import { Separator } from "@/components/ui/separator";
import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

type TGeneratorFormProps = {
  imageGenerator: TGenerateImages;
  imageSaver: TSaveImage;
  numberOfImageTokens: number;
};

// type Options<V> = (V extends string
//   ? {
//       parse: never;
//       serialize: never;
//     }
//   : {
//       parse: (value: string) => V;
//       serialize: (value: V) => string;
//     }) & { defaultValue: V };

// function useLocalStorage<K extends string, V>(key: K, options: Options<V>) {
//   const refWindow = useRef<typeof window | null>(null);
//   const [state, setState] = useState(options.defaultValue);

//   useEffect(() => {
//     refWindow.current = window;
//     if (window) {}
//     const value = refWindow.current?.sessionStorage.getItem(key) ?? null;
//     if (value !== null) {
//       if (typeof options.defaultValue === "string") {
//         setState(options.parse(value));
//       } else {
//         const newValue = options.parse(value);
//         setState(newValue);
//       }
//     }
//   });

//   function saveState(newValue: V) {
//     setState(newValue);
//     window.sessionStorage.setItem(key, serialize(newValue));
//   }

//   function getState() {
//     return state;
//   }
// }

const colorAtom = atomWithStorage<string>("color","black");
const styleAtom = atomWithStorage<TStyle>("style", styles[0]);
const numberOfImagesAtom = atomWithStorage("numberOfImages", 1);
const descriptionAtom = atomWithStorage("description", "");

export default function ImageGeneratorForm(props: TGeneratorFormProps) {
  const { imageGenerator, imageSaver } = props;
  const refCSS = useRef<typeof CSS | null>(null);


  const [color, setColor] = useAtom(colorAtom);
  const [style, setStyle] = useAtom(styleAtom);
  const [numberOfImages, setNumberOfImages] = useAtom(numberOfImagesAtom);
  const [description, setDescription] = useAtom(descriptionAtom);


  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [tokens, setTokens] = useState(props.numberOfImageTokens);
  const [images, setImages] = useState<{url:string,base64Img:string}[]>([]);


  const descriptionMaxLength = 200;
  const descriptionMinLength = 1;
  const { status } = useSession();

  useEffect(() => {
    refCSS.current = CSS;
  }, []);

  type TFormErrorMessages =
    | {
        isValid: false;
        errors: string[];
      }
    | { isValid: true };

  function validateArgs(args: {
    color: string;
    style: string;
    description: string;
  }): TFormErrorMessages {
    const { color, style, description } = args;
    let errors: string[] = [];

    if (!isTStyle(style)) {
      errors.push(`choose a style that is one of "${styles.join(",")}".`);
    }

    if (!(descriptionMinLength <= description.length)) {
      errors.push(
        `Enter a description equal to  or more than ${descriptionMinLength} character.`
      );
    }
    if (!(description.length <= descriptionMaxLength)) {
      errors.push(
        `Enter a description equal to less or than ${descriptionMaxLength} character.`
      );
    }

    if (refCSS.current === null) {
      throw Error("refCSS null");
    }

    if (!refCSS.current.supports("color", color)) {
      errors.push(
        `Color code "${color}" is not valid.Enter a valid color code.`
      );
    }

    if (0 < errors.length) {
      return { isValid: false, errors };
    }

    return { isValid: true };
  }

  async function action() {
    const args = { color, style, description, numberOfImages };

    const validationResult = validateArgs(args);

    if (!validationResult.isValid) {
      setFormErrors(validationResult.errors);
      return;
    } else {
      setFormErrors([]);
    }

    if (status !== "authenticated") {
      toast("You need to sign to be able generating icons!", {
        action: {
          label: "sign in",
          onClick: (e) => signIn(),
        },
      });
      return;
    }

    const result = await imageGenerator(args);

    if (result.isSuccess) {
      setTokens(result.ImageTokensLeft);
      setImages(result.images);
    } else {
      toast(result.message);
    }
  }

  const formAlert =
    0 < formErrors.length ? (
      <AlertInfo title="form errors">
        <ul>
          {formErrors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      </AlertInfo>
    ) : null;
  // Todo replace with shadc ui if can persist state between reloads.
  return (
    <div className="flex flex-col justify-center items-center">
      <form className="flex flex-col max-w-2xl gap-4" action={action}>
        <p className=" text-left capitalize">tokens left: {tokens}</p>
        <ColorSelector color={color} setColor={(x) => setColor(x)} />
        <StyleSelector style={style} setStyle={(x) => setStyle(x)} />

        <div>
          <Title>Other</Title>
          <Separator className="my-4" orientation="horizontal" />
          <div className="flex flex-col gap-2">
            <DescriptionInput
              description={description}
              minLength={descriptionMinLength}
              maxLength={descriptionMaxLength}
              setDescription={setDescription}
            />
            <NumberOfImagesInput
              numberOfImages={numberOfImages}
              setNumberOfImages={setNumberOfImages}
            />
          </div>
        </div>
        <SubmitButton />
        {formAlert}
      </form>

      <Images
        saver={imageSaver}
        description={description}
        style={style}
        color={color}
        images={images}
      />
    </div>
  );
}
