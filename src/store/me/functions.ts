import { Code } from '../../Constants';
import Fetch from "../../services/Fetch";
import { Helper } from '../../services/Helper';
import store from '../store';
import { RawUser } from '../types';
import * as MeSlice from './slice';


const loadProfile = async (storex = store)=>{
    const res = await Fetch.postWithAccessToken<{user: RawUser, code: number}>(`/api/me/profile`,{});
    if (res.data && res.data.code === Code.SUCCESS){
        return await storex.dispatch(MeSlice.loadProfile({user: res.data.user}));
    } else{
        return await storex.dispatch(MeSlice.loadProfile({user:null}));
    }
};


const logout = async (storex = store)=>{
    await Fetch.postWithAccessToken<any>(`/api/authentication/signout`,{});
    Fetch.setAccessToken("");
    localStorage.removeItem("access_token");
    Helper.setCookie("access_token", "", 1);
    Helper.setCookie("user_id", "", 1)
    await storex.dispatch(MeSlice.loadProfile({user: null}));
};

const init = (user: RawUser,storex = store) =>{
    return storex.dispatch(MeSlice.loadProfile({user: user}));
}

export const MeFunctions = {
    loadProfile,
    logout,
    init
};