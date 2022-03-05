import { createSlice } from "@reduxjs/toolkit";
import { RawChallenge } from "../types";

type State = {
    map_challenge_by_podcast_id: {
        [key: number]: RawChallenge[]
    },
    map_challenge_by_id :  {
        [key: number]: RawChallenge
    }
}

const initialState: State = {
    map_challenge_by_podcast_id: {},
    map_challenge_by_id:{}
};

const challengeSlice = createSlice({
    name: 'challenge',
    initialState,
    reducers: {
        loadChallenges(state, action: {
            payload: {
                map_challenge_by_podcast_id:{[key: number]: RawChallenge[]},
                map_challenge_by_id: {[key: number]: RawChallenge}
            }
        }) {
            state = {...state, ...action.payload};
            return state;
        },
    }
})

export const {
    loadChallenges,
} = challengeSlice.actions

export default challengeSlice.reducer