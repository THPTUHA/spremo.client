import { createSlice } from "@reduxjs/toolkit";
import { RawPodcastCollection } from "../types";

type State = {
    collections:RawPodcastCollection[]
}

const initialState: State = {
    collections: []
};

const podcastCollectionSlice = createSlice({
    name: 'podcastCollection',
    initialState,
    reducers: {
        loadCollections(state, action: {payload:RawPodcastCollection[]}){
            state.collections = action.payload;
            return state;
        }
    }
})

export const {
    loadCollections
} = podcastCollectionSlice.actions

export default podcastCollectionSlice.reducer