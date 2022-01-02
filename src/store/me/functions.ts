import { Code } from '../../Constants';
import CurrentUser from '../../services/CurrentUser';
import Fetch from "../../services/Fetch";
import { Helper } from '../../services/Helper';
import store from '../store';
import { RawUser } from '../types';
import * as MeSlice from './slice';


const loadProfile = async (storex = store)=>{
    const res = await Fetch.postWithAccessToken<{user: RawUser, code: number}>(`/api/me/profile`,{});
    if (res.data && res.data.code === Code.SUCCESS){
        CurrentUser.setUser(res.data.user);
        return await storex.dispatch(MeSlice.loadProfile({user: res.data.user}));
    } else{
        CurrentUser.logout();
        return await storex.dispatch(MeSlice.loadProfile({user:null}));
    }
};


const logout = async (storex = store)=>{
    await Fetch.postWithAccessToken<any>(`/api/auth/signout`,{});
    Fetch.setAccessToken("");
    CurrentUser.logout();
    localStorage.removeItem("access_token");
    Helper.setCookie("access_token", "", 1);
    Helper.setCookie("user_id", "", 1)
    await storex.dispatch(MeSlice.loadProfile({user: null}));
};


export const MeFunctions = {
    loadProfile,
    logout
};