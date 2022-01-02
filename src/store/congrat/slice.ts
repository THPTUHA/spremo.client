import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash';
import { RawBadge } from '../types';

type State = {
    congrat_msg: string
};

const initialState: State = {
    congrat_msg: ''
};

const congratSlice = createSlice({
    name: 'congrat',
    initialState,
    reducers: {
        load: (state, action: { payload: string }) => {
            state = {
                ...state,
                congrat_msg: action.payload
            };

            return state;
        },
        reset: (state, action: { payload: any }) => {
            state = {
                ...state,
                congrat_msg: ''
            };

            return state;
        }

    },
})

export const { reset, load } = congratSlice.actions
export default congratSlice.reducer