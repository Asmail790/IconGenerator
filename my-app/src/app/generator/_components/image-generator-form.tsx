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
import { Images } from "./images";
import { SubmitButton } from "./submit-button";
import { TStyle, isTStyle, styles } from "../../../_constants/styles";
import { predefinedColors } from "../../../_constants/colors";
import { imageTokens } from "schema";
import { Toaster, toast } from "sonner";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";

type TGeneratorFormProps = {
  imageGenerator: TGenerateImages;
  imageSaver: TSaveImage;
  numberOfImageTokens: number;
};

export default function ImageGeneratorForm(props: TGeneratorFormProps) {
  const { imageGenerator, imageSaver } = props;

  type TStorageKey = "description" | "color" | "style" | "numberOfImages";
  const descriptionMaxLength = 200;
  const descriptionMinLength = 1;
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [tokens, setTokens] = useState(props.numberOfImageTokens);
  const [urls, setUrls] = useState<string[]>([]);
  const [color, setColor] = useState<string>(predefinedColors[0]);
  const [style, setStyle] = useState<TStyle>(styles[0]);
  const [description, setDescription] = useState<string>("");
  const [numberOfImages, setNumberOfImages] = useState<number>(0);
  const refWindow = useRef<Window | null>(null);
  const refCSS = useRef<typeof CSS | null>(null);
  const { status } = useSession();

  useEffect(() => {
    refWindow.current = window;
    refCSS.current = CSS;
  }, []);

  useEffect(() => {
    const storedDescription = sessionStorage.getItem(
      "description" satisfies TStorageKey
    );

    if (storedDescription !== null) {
      setDescription(storedDescription);
    }

    const storedNbrOfImgs = sessionStorage.getItem(
      "numberOfImages" satisfies TStorageKey
    );

    if (storedNbrOfImgs !== null && !Number.isNaN(storedNbrOfImgs)) {
      setNumberOfImages(parseInt(storedNbrOfImgs));
    }

    const storedColor = sessionStorage.getItem("color" satisfies TStorageKey);

    if (storedColor !== null) {
      setColor(storedColor);
    }

    const storedStyle = sessionStorage.getItem("style" satisfies TStorageKey);
    if (storedStyle !== null && isTStyle(storedStyle)) {
      setStyle(storedStyle);
    }
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

    const result = await props.imageGenerator(args);

    if (result.isSuccess) {
      setTokens(result.ImageTokensLeft);
      setUrls(result.imageUrls);
    } else {
      toast(result.message);
    }
  }

  function onColorChange(value: string) {
    refWindow.current?.sessionStorage.setItem(
      "color" satisfies TStorageKey,
      String(value)
    );
    setColor(value);
  }

  function onNumberOfImagesChange(value: number) {
    refWindow.current?.sessionStorage.setItem(
      "numberOfImages" satisfies TStorageKey,
      String(value)
    );
    setNumberOfImages(value);
  }

  function onStyleChange(value: TStyle) {
    console.log(style);
    refWindow.current?.sessionStorage.setItem(
      "style" satisfies TStorageKey,
      String(value)
    );
    setStyle(value);
  }

  function onDescriptionChange(value: string) {
    refWindow.current?.sessionStorage.setItem(
      "description" satisfies TStorageKey,
      String(value)
    );
    setDescription(value);
  }

  const formAlert =
    0 < formErrors.length ? (
      <AlertInfo title="form errors">
        <ul>
          {formErrors.map((error) => (
            <li>{error}</li>
          ))}
        </ul>
      </AlertInfo>
    ) : null;
  // Todo replace with shadc ui if can persist state between reloads.
  return (
    <div className="flex flex-col justify-center items-center">
      <form className="max-w-2xl" action={action}>
        <p className="text-2xl p-2 text-left font-semibold capitalize">
          tokens left: {tokens}
        </p>
        <ColorSelector color={color} setColor={onColorChange} />
        <StyleSelector style={style} setStyle={onStyleChange} />
        <DescriptionInput
          description={description}
          minLength={descriptionMinLength}
          maxLength={descriptionMaxLength}
          setDescription={onDescriptionChange}
        />
        <NumberOfImagesInput
          numberOfImages={numberOfImages}
          setNumberOfImages={onNumberOfImagesChange}
        />
        <SubmitButton />
        {formAlert}
      </form>
      

      <Images
        saver={imageSaver}
        description={description}
        style={style}
        color={color}
        urls={urls}
      />
    </div>
  );
}
