import { useEffect, useRef, useState } from "react";
import { FaRegPaperPlane } from "react-icons/fa";
import { useAsync } from "react-use";
import { Code } from "../../Constants";
import { ChatProps, MessageProps } from "../../interface";
import { ChatFunctions } from "../../store/chat/funtions";
import { ChatHook } from "../../store/chat/hooks";
import { MeHook } from "../../store/me/hooks";
import { SocketHook } from "../../store/socket/hooks";
import { RawUser } from "../../store/types";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { StyleHook } from "../../store/style/hooks";
import { AiOutlineClose } from "react-icons/ai";

const Chat = ()=>{
    const me = MeHook.useMe();
    const socket = SocketHook.useSocket();
    const chat = ChatHook.useChat();
    const is_open = ChatHook.useUseIsOpen();
    const [content, setContent] = useState("");
    const style = StyleHook.useStyle();

    const [user, setUser] = useState<any>(null);

    useEffect(()=>{
        if(me && socket){
            socket.on('message', function(data:{chat: ChatProps}) {
                const {chat} = data;
                ChatFunctions.add(chat);
            })
        }
    },[socket])


    useEffect(()=>{
        if(chat && me){
            setUser(chat.users.filter(user => user.id != me.id)[0]);
        }
    },[chat])
    // useAsync(async()=>{
    //     if(me ){
    //         try {
    //             const res = await Fetch.postJsonWithAccessToken<{code: number, message: string, chat:ChatProps}>('/api/chat/get',{
    //                 user_id: user_id,
    //             })
    //             if(res.data){
    //                 const {code, message, chat} = res.data;
    //                 if(code == Code.SUCCESS){
    //                     ChatFunctions.add(chat);   
    //                     return;
    //                 }
    //                 Toast.error(message);
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             Toast.error("Emotional Damage!");
    //         }            
    //     }
    // },[me])
    const handleSend = ()=>{
		if(socket){
            socket.emit("chat",{message:{user: me, content: content}, chat: chat });
            setContent("");
        }
	}

    const handleEnterSend = (e:any)=>{
        if(e && e.key == "Enter"){
            handleSend();
        }
    }
    return (
        <>
            {
                is_open && (
                    <div className ="fixed right-10 bottom-0 z-50 text-white" 
                    style={{minHeight:360, maxHeight:360, minWidth:300,
                         backgroundColor: style.bg_blog_color}} >
                        <div  style={{minHeight:200, minWidth:100}} >
                            <div onClick={()=>{ChatFunctions.close()}} className="cursor-pointer w-full justify-end">
                                <AiOutlineClose/>
                            </div>
                            <div>
                                {
                                    chat && me && user && <div>
                                        <div className="flex items-center ml-3 border-b-[1px] border-white pb-1">
                                            <div>
                                                <img src={user.avatar} className="w-10 h-10 rounded-full"/>
                                            </div>
                                            <div className="ml-3">
                                                {user.username}
                                            </div>
                                        </div>
                                        <div className="fixed bottom-5 mt-2">
                                            <PerfectScrollbar style={{height: 250, marginBottom: 20,minWidth:300}} >
                                                {
                                                    chat.messages.map((message,index)=>(
                                                        <div key={index}>
                                                            {
                                                                message.user.id == me.id ? (
                                                                    <div className="flex flex-col w-full mb-3  items-end pr-3">
                                                                        <div className="text-[10px] font-medium " style={{marginLeft:120}}>{message.user.username}</div>
                                                                        <div style={{minWidth:150, maxWidth:150}} className="bg-blue-500 rounded-lg py-1 px-2">
                                                                            {message.content}
                                                                        </div>
                                                                    </div>
                                                                ):(
                                                                    <div className="flex items-center ml-3 mb-3">
                                                                        <div className=" flex items-center">
                                                                            <img src={message.user.avatar} className="w-6 h-6 rounded-full"/>
                                                                        </div>
                                                                        <div className="flex flex-col ml-3">
                                                                            <div className="text-[10px] font-medium">{message.user.username}</div>
                                                                            <div style={{minWidth:150, maxWidth:150}} className="bg-red-500 rounded-lg py-1 px-1">
                                                                                {message.content}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </PerfectScrollbar>
                                        </div>
                                    </div>
                                }
                            </div>
                            {/* <input type="text" value={content} onChange={(e)=>{setContent(e.target.value)}}/> */}
                            <div className="flex items-center bottom-1 fixed">
                                <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} onKeyPress={handleEnterSend} className="ml-3 h-8 rounded-full text-black px-2">
                                </textarea>
                                <FaRegPaperPlane className='w-6 h-auto ml-3'  onClick={handleSend}/>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default Chat;