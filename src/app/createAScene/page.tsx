'use client'
import {useEffect} from "react";
import {getScene} from "@/app/createAScene/utils";

const CreateAScene = () =>{
    useEffect(()=>{
        getScene()
    },[])
    return <div>66666666</div>
}
export default CreateAScene;
