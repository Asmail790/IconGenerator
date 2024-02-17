"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"


export default function X(){
    const [state,setState] = useState("")

    useEffect(()=>{
        setState(sessionStorage.getItem("key")?? state)
    },[])
    

    return <
        Input
        className="text-red-900"
         value={state}
        onChange={e => {
            sessionStorage.setItem("key",e.target.value)
            setState(e.target.value)
        }}
    
    type="text"></Input>
}