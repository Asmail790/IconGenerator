"use client";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

export function UserAvatar(props: { image?: string; username?: string; }) {
  return (
    <Avatar data-testid="user-avatar">
      <AvatarImage src={props.image} />
      <AvatarFallback>
        <div className="bg-purple-900 w-30 h-30   rounded-full ">
          {props.username?.at(0) ?? "User"}
        </div>
      </AvatarFallback>
    </Avatar>
  );
}
