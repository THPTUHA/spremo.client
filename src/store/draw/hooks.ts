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

const useBlog = ()=>{
    return useSelector((state) =>{
        return state.draw.present.blog;
    })
}

export const DrawHook ={
    useShape,
    useIsSave,
    useBlog
} 