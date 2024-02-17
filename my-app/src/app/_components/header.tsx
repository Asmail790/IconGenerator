"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const curentPath = usePathname();

  const { data: session, status } = useSession();

  const email = session?.user?.email ?? undefined;
  const image = session?.user?.image ?? undefined;
  const username = session?.user?.name ?? undefined;

  const links = [
    { path: "/generator", description: "icon generator", prefetch: true },
    { path: "/collection", description: "my collection", prefetch: true },
  ]
    .filter((link) => !curentPath.startsWith(link.path))
    .map((link) => (
      <Link
        prefetch={link.prefetch}
        key={link.path}
        className={cn(
          "text-white capitalize p-2 self-center bg-slate-800 rounded-xl",
          buttonVariants({ variant: "outline" })
        )}
        href={link.path}
      >
        {link.description}
      </Link>
    ));

  return (
    <div className="flex flex-row flex-wrap justify-start gap-x-4 m-4">
      <User email={email} image={image} username={username} status={status} />
      {links}
    </div>
  );
}

function User(props: {
  email?: string;
  image?: string;
  username?: string;
  status: ReturnType<typeof useSession>["status"];
}) {
  if (props.status === "unauthenticated") {
    return (
      <div>
        <button
          className={cn(
            "text-white p-2 self-center bg-slate-800 rounded-xl",
            buttonVariants({ variant: "outline" })
          )}
          onClick={() => signIn()}
        >
          Sign in
        </button>
      </div>
    );
  }

  //improve
  if (props.status === "loading") {
    return <p className="flex items-center gap-2">...loading</p>;
  }

  if (props.email === undefined) {
    throw Error("email is undefined");
  }
  if (props.username === undefined) {
    throw Error("username is undefined");
  }

  const [firstName, secondName] = props.username.split(" ");
  const correctFormatted = firstName !== undefined && secondName !== undefined;
  const letters =
    correctFormatted &&
    firstName[0] !== undefined &&
    secondName[0] !== undefined
      ? firstName[0] + secondName[0]
      : props.username.slice(0, 2);
  return (
    <Popover>
      <div className="flex flex-row items-center p-2 rounded-xl">
        <PopoverTrigger>
          <Avatar className="me-2">
            <AvatarImage src={props.image} />
            <AvatarFallback>{letters} </AvatarFallback>
          </Avatar>
        </PopoverTrigger>
        <p>{props.email}</p>
        <PopoverContent>
          <button
            className={cn(
              "text-white p-2 self-center bg-slate-800 rounded-xl",
              buttonVariants({ variant: "outline" })
            )}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign out
          </button>
        </PopoverContent>
      </div>
    </Popover>
  );
}
