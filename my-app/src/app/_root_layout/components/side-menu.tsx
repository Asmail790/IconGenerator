"use client";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogOut, Menu, UserX } from "lucide-react";
import { UserAvatar } from "./user-avatar";
import { DeleteDialog } from "./delete-dialog";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export function SideMenu(props: { 
  deleteUser: () => Promise<void> 
  links:{ path:string, description: string}[]

}) {
  const { status, data } = useSession();
  const [isOpen, setOpen] = useState(false);
  const router = useRouter();
  const curentPath = usePathname();

  if (status !== "authenticated") {
    return null;
  }

  const links = props.links.map((link) => {
    return (
      <Button
        key={link.path}
        disabled={link.path === curentPath}
        variant="outline"
        onClick={() => {
          setOpen(false);
          router.push(link.path);
        }}
      >
        {link.description}
      </Button>
    );
  });

  return (
    <Sheet  open={isOpen} onOpenChange={(v) => setOpen(v)}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <Menu className="" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>
            <div className="flex flex-row flex-wrap justify-start items-center gap-8">
              <UserAvatar
                username={data.user?.name ?? undefined}
                image={data.user?.image ?? undefined}
              />

              <p>{data.user?.name}</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-8 flex-nowrap">
          <div className="flex flex-col gap-4 flex-nowrap">
           {links}
          </div>
          <div className="flex flex-col gap-4 flex-nowrap">
            <Button
              data-testid="signOut-in-button"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
            <DeleteDialog deleteUser={props.deleteUser}>
              <Button variant="destructive" data-testid="delete account">
                <UserX className="mr-2 h-4 w-4" />
                delete Account
              </Button>
            </DeleteDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
