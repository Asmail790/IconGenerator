"use client";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export function SubmitButton() {
  const status = useFormStatus();
  const spinner = (
    <>
    {"generating images"}
    <Loader2 className="animate-spin mr-2 h-4 w-4"/>
    </>
  );
  return (
    <div>
      <button data-testid="generate" type="button" disabled></button>
      <Button
        disabled={status.pending}
        className={cn("my-4", status.pending ? "cursor-wait" : "")}
        type="submit"
      >
        {status.pending ? spinner : "Generate images"}
      </Button>
    </div>
  );
}
