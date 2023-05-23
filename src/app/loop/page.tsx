'use client'
import {useEffect} from "react";
import {draw,render3} from "./util";

const Loop = () => {
    useEffect(()=>{
        // draw()
        render3()
    })

    return <div id={'container'}></div>
}
export default Loop
