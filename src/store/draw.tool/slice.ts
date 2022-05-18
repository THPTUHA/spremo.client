import { COLORS, COLOR_DEFAULT, TOOLS } from "../../Constants"
import { DrawTool } from "../../interface"
import { createSlice } from "@reduxjs/toolkit";

type State = {
    color: string,
    tool: DrawTool
}

const initialState : State= {
    color: COLOR_DEFAULT,
    tool:{
        id: TOOLS.SELECT.id,
        option: []
    }
}

const drawToolSlice = createSlice({
    name: "drawTool",
    initialState,
    reducers:{
        changeTool: (state, action:{payload: DrawTool})=>{
            state ={
                ...state,
                tool: action.payload,
            }
            return state;
        },
        changeColor: (state, action:{payload: string}) =>{
            state = {
                ...state,
                color: action.payload
            }
            return state
        }
    }
})

export const {
    changeTool,
    changeColor
} = drawToolSlice.actions

export default drawToolSlice.reducer;