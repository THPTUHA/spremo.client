import { createSlice } from "@reduxjs/toolkit";
import { RawPodcast } from "../types";

type State = {
    podcasts: {
        [key: number]: RawPodcast
    }
}

const initialState: State = {
    podcasts: {}
};

const podcastSlice = createSlice({
    name: 'podcast',
    initialState,
    reducers: {
        loadPodcasts(state, action: {
            payload: {
                [key: number]: RawPodcast
            }
        }) {
            state.podcasts = { ...state.podcasts, ...action.payload };
            return state;
        },
        loadPodcast(state, action: {
            payload: {
                podcast: RawPodcast
            }
        }) {
            state.podcasts[action.payload.podcast.id] = action.payload.podcast;
            return state;
        }
    }
})

export const {
    loadPodcasts,
    loadPodcast
} = podcastSlice.actions

export default podcastSlice.reducer