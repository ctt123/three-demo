'use client';
import {useEffect} from "react";
import {draw} from "@/app/drawingLines/utils";

const DrawingLines = ()=>{
    useEffect(()=>{
        draw()
    },[])
    return <div style={{
        position: 'absolute',
        top: '10px',
        width: '100%',
        textAlign: 'center',
        zIndex: '100',
        display: 'block',
        color: 'white'
    }}>drawingLines</div>
}
export default DrawingLines;
