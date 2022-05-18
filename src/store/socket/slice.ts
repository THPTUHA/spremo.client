import { createSlice } from '@reduxjs/toolkit'
import { Socket} from 'socket.io-client';
import {RawUser } from '../types'
import {DefaultEventsMap} from "@socket.io/component-emitter";

type State = {
    socket: any
};
const initialState: State = {
    socket: null
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        load(state, action: { payload: { socket: Socket<DefaultEventsMap, DefaultEventsMap>} }) {
            state = {
                ...state,
                socket: action.payload.socket
            };

            return state;
        },
    },
})

export const { load } = socketSlice.actions
export default socketSlice.reducer