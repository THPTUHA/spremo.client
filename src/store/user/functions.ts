import Fetch from "../../services/Fetch";
import store from "../store";
import * as userSlice from './slice';
import {  RawUser } from "../types";
import * as _ from 'lodash';

const loadAll = async (storeX = store) => {
    try {
        var json = await localStorage.getItem('users');
        var users: RawUser[] = [];
        if (json) {
            users = JSON.parse(json);
        } else {
            var res = await Fetch.post<RawUser[]>('/api/user/list', {});

            users = res.data;
        }

        return storeX.dispatch(userSlice.loadUsers(_.fromPairs(users.map(user => [user.id, user]))))
    }
    catch (err) {
        console.log(err);
    }
}

const loadRawUsers = async (users: RawUser[], storex = store) => {
    return storex.dispatch(userSlice.loadUsers(_.fromPairs(users.map(e => [e.id, e]))))
};

const loadUserByIds = async (ids: number[]) => {
    const res = await Fetch.postWithAccessToken<{users: RawUser[]}>('/api/user/ids', {
        ids: _.union(ids).join(',')
    }, []);

    if (res.data.users) {
        UserFunctions.loadRawUsers(res.data.users);
    }
};

const loadUser = async (user: RawUser, storeX = store) => {
    return storeX.dispatch(userSlice.loadUser({ user }))

};

export const UserFunctions = {
    loadAll,
    loadUser,
    loadRawUsers,
    loadUserByIds
};