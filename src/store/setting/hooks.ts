import { useSelector } from "react-redux"

const useSetting = ()=>{
    return useSelector((state) =>{
        return state.setting;
    })
}

export const SettingHook ={
    useSetting
} 