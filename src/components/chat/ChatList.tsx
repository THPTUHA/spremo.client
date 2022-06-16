import { useAsync } from "react-use";
import Fetch from "../../services/Fetch";
import { RawUser } from "../../store/types";
import { BLOG_TYPES, Code, FRIEND, PUBLIC } from "../../Constants";
import { MeHook } from "../../store/me/hooks";
import { Toast } from "../../services/Toast";
import {useState,useMemo, useCallback} from 'react';
import {Helper} from '../../services/Helper';
import { StyleHook } from '../../store/style/hooks';
import { ChatFunctions } from "../../store/chat/funtions";

interface ChatRes{
    id:number,
    user_ids: number[],
    created_time: number,
}

interface Response{
    users: RawUser[],
    chats: ChatRes[],
    messages: IChat[][],
    code: number,
    message: string,
}

interface IChat{
    id: number,
    user_id: number,
    send_time: number,
    message: string,
    status: number
}

const mapUser = (users: RawUser[])=>{
    const mapping = {} as {[key: number]: RawUser};
    for(let i = 0; i < users.length ; ++i){
        if(!mapping[users[i].id]){
            mapping[users[i].id] = users[i]
        }
    }
    return mapping;
}

const mapMessage = (messages: IChat[][])=>{
    const mapping = {} as {[key: number]: IChat};
    for(let i = 0; i < messages.length ; ++i){
        if(messages[i][0] && !mapping[messages[i][0].id]){
            mapping[messages[i][0].id]= messages[i][0]
        }
    }
    return mapping;
}


const ChatItem = ({chat,user_map,message_map, me}:{chat: ChatRes, user_map: {[key: number]: RawUser},message_map: {[key: number]: IChat}, me: RawUser})=>{
    const other = useMemo(()=>{
        for(let i = 0 ; i< chat.user_ids.length ;++i){
            if(me.id != chat.user_ids[i]){
                return user_map[chat.user_ids[i]];
            }
        }
        return me;
    },[me])

    const message = useMemo(()=>{
        return message_map[chat.id]
    },[me])

    const getChat = async()=>{
        if(me && other){
           await ChatFunctions.get(other.id, me);
        }
    }

    return (
        <>
           {
               message && (
                <div className="flex items-center ml-3 px-2 py-1 cursor-pointer" onClick={getChat}>
                    <img src={other.avatar} className="w-8 h-8 rounded-full"/>
                    <div className="flex flex-col ml-3">
                        <div className="font-medium">{other.username}</div>
                        <div className="flex ">
                            <span className="font-medium text-sm">
                                {(me.id == message.user_id)
                                    ? "You"
                                    :  user_map[message.user_id].username}
                            </span>
                            <div className="ml-1 text-sm">{Helper.shortenText(message.message, 30)}</div>
                        </div>
                    </div>
                </div>
               )
           }
        </>
    )
}

const ChatList = ()=>{
    const me = MeHook.useMe();
    const [user_map, setUserMap] = useState<{[key: number]: RawUser}>({});
    const [message_map, setMessageMap] = useState<{[key: number]: IChat}>({});
    const style = StyleHook.useStyle();

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/chat/list",{});

            if(res.data){
                const {code,message, chats , users , messages} = res.data;
                if(code == Code.SUCCESS){
                    console.log("Message",messages,chats);
                    setUserMap(mapUser(users));
                    setMessageMap(mapMessage(messages));
                    return {
                        chats: chats
                    }
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
        return {
            chats: []
        }
    },[])

    return (
        <div className="fixed text-white rounded ml-10 mt-3"
            style={{
                backgroundColor: style.bg_blog_color,
                minWidth:250
            }}>
            {
                state.loading ? <div>Loading...</div>: state.value && me &&
                    <div className="w-full">
                        {
                           state.value.chats.map(chat =>(
                                <div key={chat.id}>
                                    <ChatItem 
                                        user_map={user_map}
                                        me = {me}
                                        chat = { chat}
                                        message_map = {message_map}
                                    />
                                </div>
                           ))
                        }
                    </div>
            }
        </div>
    )
}

export default ChatList;