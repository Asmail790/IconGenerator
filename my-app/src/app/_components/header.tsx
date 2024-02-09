"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const curentPath = usePathname();

  const { data: session ,status} = useSession();

  

  const links = [
    { path: "/generator", description: "generator" },
    { path: "/collection", description: "collection" },
  ]
    .filter((link) => !curentPath.startsWith(link.path))
    .map((link) => (
      <Link
        key={link.path}
        className={buttonVariants({ variant: "outline" })}
        href={link.path}
      >
        {link.description}
      </Link>
    ));

  return (
    <div className="flex flex-row justify-between">
      <div>{links}</div>

      {session ? (
        <>
          Signed in as {session.user?.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}

      <Button></Button>
    </div>
  );
}
