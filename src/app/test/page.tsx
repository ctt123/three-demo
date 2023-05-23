'use client'
import {useEffect} from "react";
import {draw} from "@/app/test/util";

const Test = () => {
    useEffect(()=>{
        draw();
    },[])
    return <div></div>

}
export default Test;
