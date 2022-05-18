import {useSelector } from 'react-redux'

const useIsOpen = ()=>{
    return useSelector((state)=> {
       return state.voiceRecorder.is_open;
    });
};

const useAll = ()=>{
    return useSelector((state)=> {
       return state.voiceRecorder;
    });
};
export const voiceRecoderHook = {
    useIsOpen,
    useAll
};