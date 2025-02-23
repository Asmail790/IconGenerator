"use client";
import { URLtoImageID } from "@/app/api/image/[imageID]/_logic/url-converter";
import { Button, buttonVariants } from "@/components/ui/button";
import { ReactElement, ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@radix-ui/react-separator";
import { link } from "fs";
import { Delete, Download, Info, Trash } from "lucide-react";
import Image from "next/image";
import { Component, PropsWithChildren, useState } from "react";

type TItem = {
  description: string;
  deleteFunc: (imageUrl: string) => Promise<void>;
  imageUrl: string;
  style: string;
  color: string;
};
export function Item(itemProp: TItem) {
  const { description, imageUrl, color, style, deleteFunc } = itemProp;
  const imageId = URLtoImageID(imageUrl);

  const completeUrl = "https://icon-generator-seven.vercel.app" + imageUrl;
  console.log(completeUrl);

  return (
    <Card className="w-52 flex flex-col justify-between h-fit">
      <CardContent className="px-0 flex flex-row justify-center">
        <Image alt={description} width={256} height={256} src={imageUrl} />
      </CardContent>
      <CardHeader className="pt-0">
        <CardDescription className="px-0 line-clamp-3">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="px-0 mx-auto">
        <div className="w-full flex flex-row justify-evenly gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={async () => await deleteFunc(imageUrl)}
                  variant="outline"
                  size="icon"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={imageUrl}
                  download={imageId}
                  className={buttonVariants({ variant: "outline" })}
                >
                  <Download className="h-4 w-4" />
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download icon</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <ResponsiveDialog
            color={color}
            style={style}
            description={description}
          >
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </ResponsiveDialog>
        </div>
      </CardFooter>
    </Card>
  );
}

function ResponsiveDialog(
  props: PropsWithChildren<{
    description: string;
    color: string;
    style: string;
  }>
) {
  const { description, color, style } = props;

  const info = (
    <ImageTableInfo description={description} color={color} style={style} />
  );
  const title = <p>{"Details"}</p>;

  //Todo use tailwind breakpoints direclty
  const button = (
    <Button variant="outline" size="icon">
      <Info  className="h-4 w-4" />
    </Button>
  );

  return (
    <>
      <div className="hidden md:block">
        <ImageInfoDrawer button={button} info={info} title={title} />
      </div>
      <div className="block md:hidden">
        <ImageInfoDialog button={button} info={info} title={title} />
      </div>
    </>
  );
}

function ImageInfoDialog(props: {
  info: ReactNode;
  title: ReactNode;
  button: ReactNode;
}) {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{props.button}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.info}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ImageInfoDrawer(props: {
  info: ReactNode;
  title: ReactNode;
  button: ReactNode;
}) {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
      <DrawerTrigger asChild>{props.button}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.info}</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ImageTableInfo(props: {
  description: string;
  color: string;
  style: string;
}) {
  const { description, color, style } = props;
  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell className="font-bold">Description</TableCell>
          <TableCell>{description}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Color</TableCell>
          <TableCell>{color}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-bold">Style</TableCell>
          <TableCell>{style}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
