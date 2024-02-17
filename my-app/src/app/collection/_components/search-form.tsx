"use client";

import { usePathname } from "next/navigation";
import { FuncArgs } from "../_actions/search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type RedirectFunc = (args: FuncArgs) => Promise<void>;
type Props = { args: { style?: string; description?: string } };
export function SearchForm(props: {
  args: { style?: string; description?: string; search: RedirectFunc };
}) {
  const path = usePathname();

  // TODO change style input to select tag
  return (
    <form className="max-w-2xl mx-auto" action={(data) => props.args.search({ data, invalidatedPath: path })}>
      <div className="py-4">
        <Label htmlFor="description">Description</Label>
        <Input
          type="text"
          name="description"
          defaultValue={props.args.description}
        />
      </div>
      <div className="py-4">
        <Label htmlFor="style">Style</Label>
        <Input type="text" name="style" defaultValue={props.args.style} />
      </div>
      <Button className="my-4" type="submit">
        search
      </Button>
    </form>
  );
}
