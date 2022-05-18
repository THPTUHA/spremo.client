import {useSelector } from 'react-redux'

const useChat = ()=>{
    return useSelector((state)=> {
       return state.chat.chat;
    });
};

const useUseIsOpen = ()=>{
    return useSelector((state)=> {
        return state.chat.is_open;
     });
}


export const ChatHook = {
    useChat,
    useUseIsOpen
};