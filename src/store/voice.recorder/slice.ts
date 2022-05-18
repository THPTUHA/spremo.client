import { createSlice } from '@reduxjs/toolkit'

type State = {
    is_open: boolean,
    is_create: boolean,
    url: string,
    id: number
};

const initialState: State = {
    is_open: false,
    is_create: true,
    url:"",
    id: 0
};

const voiceRecoderSlice = createSlice({
    name: 'voiceRecorder',
    initialState,
    reducers: {
        open(state,action:{payload:{url: string, is_create: boolean,id: number}}){
            state = {
                ...state,
                ...action.payload,
                is_open: true,
            }
            return state;
        },
        close(state){
            state = {
                ...state,
                is_open: false,
                url:"",
            }
            return state;
        },
    },
})

export const { open ,close} = voiceRecoderSlice.actions
export default voiceRecoderSlice.reducer