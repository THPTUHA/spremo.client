import { Code } from '../../Constants';
import { Chat, ChatProps, MessageProps } from '../../interface';
import store from '../store';
import { RawUser } from '../types';
import * as ChatActions from './slice';
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";

const add = (chat: ChatProps, storex = store)=>{
    storex.dispatch(ChatActions.add({chat:chat}));
};

const close = (storex = store)=>{
    console.log("CLOSE");
    storex.dispatch(ChatActions.close({is_open: false}));
};

const get = async(user_id: number,me: RawUser,storex = store)=>{
    try {
        const res = await Fetch.postJsonWithAccessToken<Chat>("/api/chat/get",{
            user_id: user_id
        });

        if(res.data){
            const {code,message, chat,messages,users ,user} = res.data;
            if(code == Code.SUCCESS){
                const message_init = messages.map(mes =>{
                    return {
                        content: mes.message,
                        user: users.filter(user => user.id == mes.user_id)[0]
                    }
                })
                const chat_init = {
                    id: chat.id,
                    avatar: users.filter(user => user.id != me.id)[0].avatar,
                    users: users,
                    messages: message_init
                }
                storex.dispatch(ChatActions.add({chat:chat_init}));
            }else{
                Toast.error(message);
            }
        }
    } catch (error) {
        Toast.error("Emotional Damage!");
    }
}

export const ChatFunctions = {
    add,
    close,
    get
};