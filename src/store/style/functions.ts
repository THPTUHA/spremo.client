import store from "../store";
import * as styleSlice from './slice';


const setTextColor = (text_color: string, storex = store) => {
    return storex.dispatch(styleSlice.changeTextColor(text_color))
};

const setBGColor = (bg_color: string, storex = store) => {
    return storex.dispatch(styleSlice.changeBGColor(bg_color))
};

const setTextFont = (text_font: string, storex = store) => {
    return storex.dispatch(styleSlice.changeTextFont(text_font))
};

const reset =(storex = store)=>{
    return storex.dispatch(styleSlice.reset());
}

const setStyle = (emotion_id: number,storex = store) =>{
    return storex.dispatch(styleSlice.emotionChange(emotion_id))
}

const setLocaion = (location:any,storex = store) =>{
    return storex.dispatch(styleSlice.setLocaion(location))
}

const setBlogListLayout = (blog_list_layout:number,storex = store) =>{
    return storex.dispatch(styleSlice.changeBlogListLayout(blog_list_layout))
}

export const StyleFunctions = {
    setTextColor,
    setBGColor,
    setTextFont,
    setBlogListLayout,
    reset,
    setLocaion,
    setStyle
}