"use client";
import { PropsWithChildren } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AlertInfo(
  props: PropsWithChildren<{
    title: string;
  }>
) {
  return (
    <Alert className="mb-4">
      <AlertTitle className="flex flex-row items-center gap-2">
        <AlertCircle className="h-8 w-8" />
        <p>{props.title}</p>
      </AlertTitle>
      <AlertDescription>{props.children}</AlertDescription>
    </Alert>
  );
}
