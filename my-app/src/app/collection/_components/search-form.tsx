"use client";

import { usePathname } from "next/navigation";
import { z } from "zod";
import { FuncArgs } from "../actions/search";

type RedirectFunc = (args: FuncArgs) => Promise<void>;
type Props = { args: { style?: string; description?: string } };
export function SearchForm(props: {
  args: { style?: string; description?: string; search: RedirectFunc };
}) {
  const path = usePathname();

  return (
    <form action={(data) => props.args.search({ data, invalidatedPath: path })}>
      <label className="text-base" htmlFor="description">
        Sescription
      </label>
      <input
        className="bg-gray-900 p-2 block  w-full"
        type="text"
        name="description"
        defaultValue={props.args.description}
      />
      <label className="text-base" htmlFor="style">
        Style
      </label>
      <input
        className="bg-gray-900 p-2 block w-full"
        type="text"
        name="style"
        defaultValue={props.args.style}
      />
      <button type="submit">submit</button>
    </form>
  );
}
