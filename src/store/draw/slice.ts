import { createSlice } from "@reduxjs/toolkit";

type State = {
    shapes: any[],
    id: number,
    is_save: boolean
}

const initialState : State= {
    id: 0,
    shapes: [{key: 0}],
    is_save: false
}

const drawSlice = createSlice({
    name: "draw",
    initialState,
    reducers:{
       save(state, action:{payload: any}){
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
       init(state,action:{payload: {shapes: any, id: number}}){
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