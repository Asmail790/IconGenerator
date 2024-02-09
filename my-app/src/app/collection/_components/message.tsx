"use client";

import { Button } from "@/components/ui/button";

export function SignMessage(props:{signIn:()=>void}) {
  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full h-full ">
      <p>you need to sign to se this page</p>
      <Button onClick={() => props.signIn()}>Sign in</Button>
    </div>
  );
}
