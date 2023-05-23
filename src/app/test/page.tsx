'use client'
import {useEffect} from "react";
import {draw} from "@/app/test/util";

const Test = () => {
    useEffect(()=>{
        draw();
    },[])
    return <div id={'root'}></div>

}
export default Test;
