'use client'
import {useEffect} from "react";
import {draw} from "./util";

const Loop = () => {
    useEffect(()=>{
        draw()
    })

    return <div></div>
}
export default Loop