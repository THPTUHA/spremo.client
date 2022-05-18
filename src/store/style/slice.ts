import { createSlice } from "@reduxjs/toolkit";
import { BG_COLOR_DEFAULT, EMOTION_IDS, TEXT_COLOR_DEFAULT, TEXT_FONT_DEFAULT ,STYLE_ANGRY, STYLE_HAPPY, STYLE_OK, STYLE_GOOD, STYLE_SAD} from "../../Constants";
import { RawUser } from "../types";

type State = {
    text_font: string ,
    text_color:string ,
    bg_color: string,
    bg_blog_color: string,
    text_tool__color: string,
    draw_tool_color: string,
    voice_tool_color: string,
    layout: number,
    reset: boolean
}

const initialState: State = {
    text_font: TEXT_FONT_DEFAULT ,
    text_color: "white" ,
    bg_color: "black",
    bg_blog_color: "#222222",
    text_tool__color: "white",
    draw_tool_color: "green",
    voice_tool_color: "red",
    layout: 0,
    reset: false
};

const styleSlice = createSlice({
    name: 'style',
    initialState,
    reducers: {
        changeTextFont(state, action: { payload: string}) {
            state = {
                ...state,
                text_font: action.payload
            };
            return state;
        },
        changeTextColor(state, action: { payload: string}) {
            state = {
                ...state,
                text_color: action.payload
            };
            return state;
        },
        changeBGColor(state, action: { payload: string}) {
            state = {
                ...state,
                bg_color: action.payload
            };
            return state;
        },
        reset(state){
            state = {
                ...state,
                reset: !state.reset
            };
            return state;
        },
        emotionChange(state, action: { payload: number}){
            switch(action.payload){
                case EMOTION_IDS.ANGRY:
                    state = {
                        ...state,
                        ...STYLE_ANGRY
                    }
                    return state;
                case EMOTION_IDS.HAPPY:
                    state = {
                        ...state,
                        ...STYLE_HAPPY
                    }
                    return state;
                case EMOTION_IDS.OK:
                    state = {
                        ...state,
                        ...STYLE_OK
                    }
                    return state;
                case EMOTION_IDS.GOOD:
                    state = {
                        ...state,
                        ...STYLE_GOOD
                    }
                    return state;
                case EMOTION_IDS.SAD:
                    state = {
                        ...state,
                        ...STYLE_SAD
                    }
                    return state;
            }
        }
    }
})

export const {
    changeTextFont,
    changeTextColor,
    changeBGColor,
    reset,
    emotionChange
} = styleSlice.actions

export default styleSlice.reducer