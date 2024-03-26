"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Circle, Loader2, LogIn, LogOut, UserX } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";
import { DeleteDialog } from "./delete-dialog";

export function User(props: {
  deleteUser: () => Promise<void>;
  email?: string;
  image?: string;
  username?: string;
}) {
  const { status, data } = useSession();
  if (status === "unauthenticated") {
    return null;
  }

  //improve

  if (status === "loading") {
    return  <Loader2 className="ms-2 animate-spin"/>
  }

  return (
    <Popover>
      <div className="flex flex-row items-center rounded-xl">
        <PopoverTrigger>
          <UserAvatar
            image={data?.user?.image ?? undefined}
            username={data?.user?.name ?? undefined}
          />
        </PopoverTrigger>
        <PopoverContent className="w-fit flex flex-col gap-4">
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
        </PopoverContent>
      </div>
    </Popover>
  );
}


