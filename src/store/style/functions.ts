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
export const StyleFunctions = {
    setTextColor,
    setBGColor,
    setTextFont,
    reset,
    setStyle
}