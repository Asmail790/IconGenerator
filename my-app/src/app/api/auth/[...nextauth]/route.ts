import { NextRequest } from "next/server"
import  { nextAuthPromiseInstance as nextAuthInstance_} from "./config"





export  async function GET(request:NextRequest) {
    const nextAuthInstance = await nextAuthInstance_
    return nextAuthInstance.handlers.GET(request)
}


export  async function POST(request:NextRequest) {
    const nextAuthInstance = await nextAuthInstance_
    return nextAuthInstance.handlers.POST(request)
}