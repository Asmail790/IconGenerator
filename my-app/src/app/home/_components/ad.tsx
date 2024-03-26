"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
export default function AD() {
  const { status } = useSession();
  const signButton =
    status === "authenticated" ? null : status == "loading" ? (
      <Loader2 className="animate-spin" />
    ) : (
      <Button
        data-testid="sign-in-button"
        onClick={() => signIn()}
      >
        <LogIn className="mr-2 h-4 w-4" />
        Sign in
      </Button>
    );

  const images = [
    "0446bbc5-4b15-486b-8dda-732cccbef3e9.png",
    "14b5ce9c-132b-4a78-bff7-34466ff1291c.png",
    "35441af7-6446-4ed2-8a67-2fb9ce7980cf.png",
    "35bc2cba-5152-426d-9bb3-d8320f263102.png",
    "3Kl4K2tv.png",
    "4a4937b0-bcc0-4393-a29a-e8ac2bcacb37.png",
    "4d7025c1-b909-4d1a-9e5c-75ac7916b146.png",
    "62130502-2b92-47f0-8e26-5b0ccc725f22.png",
    "64839445-c6af-4be6-b84c-984c11b492b9.png",
    "92be9e3e-24d0-4c48-a5c3-770716b3dfac.png",
    "a2cbe0e4-0ff2-4485-b0b2-515965ab64be.png",
    "b1fa48ac-ab70-4849-a254-b4a5a96c9767.png",
    "BALj930m.png",
    "cef0120a-b2e5-4633-bb5a-a8e669033633.png",
    "ebe9ce48-b6c2-4d30-b758-347cb9c97891.png",
    "f1223da3-5cf2-4e7c-9f91-cc4db94a1be0.png",
    "f8c10978-2c0b-47fa-9067-60faf7c7e351.png",
    "ffc97ec5-f7ec-4a3b-b031-aec9dc7d08eb.png",
    "HjdY_WiH.png",
    "vDOpfAWz.png",
  ].map((fileName) => "/static/" + fileName);

  return (
    <div className=" p-6 w-full flex flex-col gap-8">
      <h1 className="text-3xl">
        Generate fast and efficient icons for your projects.
      </h1>
      <p>
        Save time by generating icons for your businesses website, applications,
        or brand using our AI digital icon generator.
      </p>
      <Link
        data-testid="generate-link"
        className={cn(
          "w-fit self-center",
          buttonVariants({ variant: "outline" })
        )}
        href="/generator"
      >
        start generate icons now
      </Link>

      <div className="self-center">
        {signButton}
      </div>

      <div className="w-full flex flex-row flex-wrap gap-8 m-2">
        {images.map((url, i) => (
          <Image
            className="w-16 md:w-32 aspect-square"
            key={i}
            src={url}
            height={128}
            width={128}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}
