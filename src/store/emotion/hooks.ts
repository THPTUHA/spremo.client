import { useSelector } from "react-redux"

const useEmotion = ()=>{
    return useSelector((state) =>{
        return state.emotion;
    })
}

export const EmotionHook ={
    useEmotion
} 