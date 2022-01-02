import { createSlice } from "@reduxjs/toolkit";
import { RawUser } from "../types";

type State = {
    users: {
        [key: number]: RawUser
    }
}

const initialState: State = {
    users: {}
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loadUsers(state, action: {
            payload: {
                [key: number]: RawUser
            }
        }) {
            state.users = { ...state.users, ...action.payload };
            return state;
        },
        loadUser(state, action: {
            payload: {
                user: RawUser
            }
        }) {
            state.users[action.payload.user.id] = action.payload.user;
            return state;
        }
    }
})

export const {
    loadUsers,
    loadUser
} = userSlice.actions

export default userSlice.reducer