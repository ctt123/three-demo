'use client'
import {useEffect} from "react";
import {draw} from "@/app/clipping/util";

const Clipping = ()=>{
    useEffect(()=>{
        draw()
    },[])
    return <div></div>
}
export default Clipping;
