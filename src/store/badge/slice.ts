import { createSlice } from '@reduxjs/toolkit'
import _ from 'lodash';
import { RawBadge } from '../types';

type State = {
    badges: RawBadge[]
};

const initialState: State = {
    badges: []
};

const badgeSlice = createSlice({
    name: 'bagde',
    initialState,
    reducers: {
        init: (state, action: { payload: RawBadge[] }) => {
            state = {
                ...state,
                badges: action.payload
            };

            return state;
        },
        load: (state, action: { payload: RawBadge[] }) => {
            state = {
                ...state,
                badges: [...state.badges, ...action.payload]
            };

            return state;
        },
        seen: (state, action: { payload: number }) => {
            state = {
                ...state,
                badges: state.badges.filter(e => e.id != action.payload)
            };

            return state;
        },
    },
})

export const { init, load, seen } = badgeSlice.actions
export default badgeSlice.reducer