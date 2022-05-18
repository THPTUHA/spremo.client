import { useNavigate } from "react-router-dom";
import { MeHook } from "../store/me/hooks";
import  {useEffect } from 'react';

export function useMe(){
    const me = MeHook.useMe();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!me){
            navigate("../authentication/login");
        }
    },[me])
    return me;
}
