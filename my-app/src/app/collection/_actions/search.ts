"use server"

import { redirect } from "next/navigation"
import { z } from "zod"



const schema1 = z.instanceof(FormData).transform( data =>( {
  style:data.get("style"),
  description:data.get("description")
})).pipe( z.object({
    style:z.string().optional(),
    description:z.string().optional()
}))

const schema2 = z.string()
const schema = z.object({
    data:schema1,
    invalidatedPath:schema2
}).transform(obj => ({
    data:obj.data,
    path: obj.invalidatedPath
}))


export type FuncArgs ={data:FormData,invalidatedPath:string}
export type ReturnValue = Promise<void>

export async function search(args:FuncArgs):Promise<void>{
    const {data,path} = schema.parse(args)
    const query = new URLSearchParams()

    for (const [key,value] of Object.entries(data)){
        if (value !== undefined){
            query.append(key,value)
        }

    }

    const searchURL = path + "?" + query.toString()
    redirect(searchURL)
} 