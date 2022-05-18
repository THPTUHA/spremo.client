import { createSlice } from '@reduxjs/toolkit'
import { ChatProps, MessageProps } from '../../interface';
import { RawUser } from '../types';


const MAX_CHAT = 2;
type State = {
    chat: ChatProps | null,
    is_open: boolean
    // priority: number
};

const initialState: State = {
    chat: null,
    is_open: false
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        add(state, action: { payload:{chat: ChatProps} }) {
            state = {
                ...state,
               chat: action.payload.chat,
               is_open: true
            }

            return state;
        },
        
        close(state,action:{payload:{is_open: boolean}}){
            state = {
                ...state,
                is_open: action.payload.is_open
            }
            return state;
        }
    },
})

export const { add,close } = chatSlice.actions
export default chatSlice.reducer