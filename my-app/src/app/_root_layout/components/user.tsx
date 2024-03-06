
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { LogIn, LogOut, UserX } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { PropsWithChildren } from "react";


export function User(props: {
    deleteUser:() => Promise<void>
    email?: string;
    image?: string;
    username?: string;
    status: ReturnType<typeof useSession>["status"];
  }) {
    if (props.status === "unauthenticated") {
      return (
        <div>
          <Button data-testid="sign-in-button" onClick={() => signIn()}>
            <LogIn className="mr-2 h-4 w-4"/>
            Sign in
          </Button>
        </div>
      );
    }
  
    //improve
  
    if (props.status === "loading") {
      return (
        <Avatar>
          <AvatarFallback> </AvatarFallback>
        </Avatar>
      );
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
        <div className="flex flex-row items-center rounded-xl">
          <PopoverTrigger>
            <Avatar data-testid="user-avatar">
              <AvatarImage src={props.image} />
              <AvatarFallback>{letters} </AvatarFallback>
            </Avatar>
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
  
  function DeleteDialog(props: PropsWithChildren<{deleteUser: ()=>Promise<void>}>) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
         {props.children}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel >Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={async()=>
                {
                    await signOut({ callbackUrl: "/" })
                    await props.deleteUser()
                }
                }>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }