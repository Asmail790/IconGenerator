"use client";


import { Button, buttonVariants } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { User } from "./user";

export function Header(props:{deleteUser:()=>Promise<void>}) {
  const router = useRouter();
  const curentPath = usePathname();

  const { data: session, status } = useSession();

  const email = session?.user?.email ?? undefined;
  const image = session?.user?.image ?? undefined;
  const username = session?.user?.name ?? undefined;

  const links = [
    { path: "/home", description: "Home" },
    { path: "/generator", description: "Icon generator" },
    { path: "/collection", description: "My collection" },
  ].map((link) => {
    return (
      <Button
        key={link.path}
        disabled={link.path === curentPath}
        variant="outline"
        onClick={() => router.push(link.path)}
      >
        {link.description}
      </Button>
    );
  });

  return (
    <header className="flex flex-row flex-wrap justify-between m-2">
      <div className="flex flex-row justify-start gap-2">{links}</div>
      <User deleteUser={props.deleteUser} email={email} image={image} username={username} status={status} />
    </header>
  );
}

