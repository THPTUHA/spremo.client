import {useSelector } from 'react-redux'

const useSocket = ()=>{
    return useSelector((state)=> {
       return state.socket.socket;
    });
};

export const SocketHook = {
    useSocket
};