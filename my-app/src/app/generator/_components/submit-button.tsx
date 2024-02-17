"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SpinAnimation } from "./spin-animation";

export function SubmitButton() {
  const status = useFormStatus();
  const spinner = (
    <SpinAnimation>
      <p className="ps-2">Generating images</p>
    </SpinAnimation>
  );
  return (
    <>
      <button type="button" disabled></button>
      <Button
        disabled={status.pending}
        className={cn("my-4", status.pending ? "cursor-wait" : "")}
        type="submit"
      >
        {status.pending ? spinner : "Generate images"}
      </Button>
    </>
  );
}
