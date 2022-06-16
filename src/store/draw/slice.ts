import { createSlice } from "@reduxjs/toolkit";
import { RawBlog, ShapeType } from "../types";

type State = {
    shapes: ShapeType[],
    blog: RawBlog | null,
    is_save: boolean
}

const initialState : State= {
    blog: null,
    shapes: [{key: 0}],
    is_save: false
}

const drawSlice = createSlice({
    name: "draw",
    initialState,
    reducers:{
       save(state, action:{payload: ShapeType[]}){
            state ={
                ...state,
                shapes: action.payload,
                is_save: false
            }
            return state;
       },
       saveServer(state){
            state ={
                ...state,
                is_save: true
            }
            return state;
       },
       init(state,action:{payload: {shapes: ShapeType[], blog: RawBlog}}){
            state ={
                ...state,
                ...action.payload,
                is_save: true
            }
            return state;
       }
    }
})

export const {
    save,
    saveServer,
    init
} = drawSlice.actions

export default drawSlice.reducer;