import { useSelector } from "react-redux"

const useShape = ()=>{
    return useSelector((state) =>{
        return state.draw.present.shapes;
    })
}

const useIsSave = ()=>{
    return useSelector((state) =>{
        return state.draw.present.is_save;
    })
}

const useDrawId = ()=>{
    return useSelector((state) =>{
        return state.draw.present.id;
    })
}
export const DrawHook ={
    useShape,
    useIsSave,
    useDrawId
} 