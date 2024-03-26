"use client";

import { useSession } from "next-auth/react";
import { User } from "./user";
import { SideMenu } from "./side-menu";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header(props: { deleteUser: () => Promise<void> }) {
  const { data: session, status } = useSession();

  const email = session?.user?.email ?? undefined;
  const image = session?.user?.image ?? undefined;
  const username = session?.user?.name ?? undefined;

  const router = useRouter();
  const curentPath = usePathname();

  const links = [
    { path: "/home", description: "Home" },
    { path: "/generator", description: "Icon generator" },
    { path: "/collection", description: "My collection" },
  ];

  const linkButtons = links.map((link) => {
    return (
      <Button
        key={link.path}
        disabled={link.path === curentPath}
        variant="outline"
        onClick={() => {
          router.push(link.path);
        }}
      >
        {link.description}
      </Button>
    );
  });

  return (
    <>
      <header className="hidden md:flex flex-row justify-between p-2">
        <div className="flex flex-row gap-2">{linkButtons}</div>
        <div className="w-fit self-end">
          <User
            deleteUser={props.deleteUser}
            email={email}
            image={image}
            username={username}
          />
        </div>
      </header>
      <div className="block md:hidden">
        <SideMenu links={links} deleteUser={props.deleteUser} />
      </div>
    </>
  );
}
