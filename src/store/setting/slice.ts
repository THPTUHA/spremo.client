import { createSlice } from "@reduxjs/toolkit";
import { RawSetting } from "../types";

const initialState = {
    settings: [] as RawSetting[]
}

const settingSlice = createSlice({
    name: "setting",
    initialState,
    reducers:{
        set: (state, action:{payload: {settings: RawSetting[]}})=>{
            return {
                ...state,
                settings: action.payload.settings
            }
        },
    }
})

export const {
    set,
} = settingSlice.actions

export default settingSlice.reducer;