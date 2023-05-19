'use client'
import {useEffect} from "react";
import {draw} from "@/app/light/util";

const Light = () =>{
    useEffect(()=>{
        draw()
    },[])
    return <div >
        <canvas id="c" style={{width: '100%', height: '100%', display: 'block'}}></canvas>
    </div>
}
export default Light
