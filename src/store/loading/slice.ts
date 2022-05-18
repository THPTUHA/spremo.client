import { createSlice } from '@reduxjs/toolkit'


type State = {
    loading: boolean,
    status: string,
    progress: number,
    show_loading: any
};

const initialState: State = {
    loading: false,
    status: 'success',
    progress: 0,
    show_loading: true
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        loading: (state, action: { payload: {value: boolean, progress: number, show_loading: any} }) => {
            state = {
                ...state,
                loading: action.payload.value,
                progress: action.payload.progress,
                show_loading: action.payload.show_loading
            };

            return state
        }
    },
})

export const { loading } = loadingSlice.actions
export default loadingSlice.reducer