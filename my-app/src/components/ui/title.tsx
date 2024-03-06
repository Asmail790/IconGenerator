import { PropsWithChildren } from "react";

export function Title(props:PropsWithChildren){
    return <h1 className="font-bold text-2xl">{props.children}</h1>
}