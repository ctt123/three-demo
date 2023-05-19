'use client'
import {useEffect} from "react";
import {drawCircle} from "@/app/clipping/util";

const Clipping = ()=>{
    useEffect(()=>{
        drawCircle()
    },[])
    return <div></div>
}
export default Clipping;
