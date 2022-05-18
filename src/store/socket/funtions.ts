import store from '../store';
import * as SocketActions from './slice';
import socketIOClient from "socket.io-client";
import { ENDPOINT } from '../../Constants';
import Fetch from '../../services/Fetch';


const init = async (storex = store)=>{
    const access_token = Fetch.getAccessToken();
   if(access_token){
        const socket = await socketIOClient(ENDPOINT,{query: {
            auth_token: access_token
        }});
        await storex.dispatch(SocketActions.load({socket:socket}));
   } 
};



export const SocketFunctions = {
    init,
};