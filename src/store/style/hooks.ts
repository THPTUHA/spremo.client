import { useSelector } from "react-redux"

const useStyle = ()=>{
    return useSelector((state)=>{
        return state.style
    })
}

const useBGColor = ()=>{
    return useSelector((state)=>{
        return state.style.bg_color
    })
}

const useTextColor = ()=>{
    return useSelector((state)=>{
        return state.style.text_color
    })
}
const useTextFont = ()=>{
    return useSelector((state)=>{
        return state.style.text_font
    })
}

const useReset = ()=>{
    return useSelector((state)=>{
        return state.style.reset
    })
}

export const StyleHook  = {
    useStyle,
    useBGColor,
    useTextColor,
    useTextFont,
    useReset
} 