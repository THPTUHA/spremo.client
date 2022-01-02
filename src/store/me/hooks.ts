import {useSelector } from 'react-redux'

const useMe = ()=>{
    return useSelector((state)=> {
       return state.me.profile;
    });
};

export const MeHook = {
    useMe
};