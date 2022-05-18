import { useSelector } from "react-redux"

const useTool = ()=>{
    return useSelector((state) =>{
        return state.drawTool.tool;
    })
}

const useColor = ()=>{
    return useSelector((state)=>{
        return state.drawTool.color;
    })
}
export const DrawToolHook ={
    useTool,
    useColor,
} 