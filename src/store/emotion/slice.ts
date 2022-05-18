import { createSlice } from "@reduxjs/toolkit";

type State = {
    id: number,
    is_change: boolean
}

const initialState : State= {
    id: 0,
    is_change: false
}

const emotionSlice = createSlice({
    name: "emotion",
    initialState,
    reducers:{
        changeEmtion(state, action:{payload: {
            id: number,
            is_change: boolean
        }}){
            state ={
                ...state,
                ...action.payload
            }
            return state;
       },
       readyChange(state, action:{payload: boolean}){
        state ={
            ...state,
            is_change: action.payload,
        }
        return state;
       }
    }
})

export const {
    changeEmtion,
    readyChange
} = emotionSlice.actions

export default emotionSlice.reducer;