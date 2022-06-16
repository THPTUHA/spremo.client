import {Dispatch, SetStateAction, useEffect, useMemo, useState} from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
import { RiUserFollowLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { Code, FRIEND, PUBLIC } from '../../Constants';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { ChatFunctions } from '../../store/chat/funtions';
import { MeHook } from '../../store/me/hooks';
import { RawUser } from '../../store/types';
import Follow from '../actionUser/Follow';
import OutsideHoverDetect from '../ui/OutsideHoverDetect';

interface IChat{
    id: number,
    user_id: number,
    send_time: number,
    message: string,
    status: number
}

interface ChatRes{
    id:number,
    user_ids: number[],
    created_time: number
}

interface Chat{
    code: number,
    message: string, 
    chat: ChatRes, 
    messages:IChat[],
    users: RawUser[]
}

const Represent = ({user, size}:{user: RawUser, size: number})=>{
    const me = MeHook.useMe();
    const [open_view, setOpenView] = useState(false);
    
    useEffect(()=>{
        if(me){
            if(me.following.includes(user.id)){
                
            }
        }
    },[me])

    const getChat = async()=>{
		if(me){
			try {
				const res = await Fetch.postJsonWithAccessToken<Chat>("/api/chat/get",{
					user_id: user.id
				});

				if(res.data){
					const {code,message, chat,messages,users } = res.data;
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
						ChatFunctions.add(chat_init);
					}else{
						Toast.error(message);
					}
				}
			} catch (error) {
				Toast.error("Emotional Damage!");
			}
		}
	}
    const location = useLocation();
    return (
        <OutsideHoverDetect outsideFunc={() => setOpenView(false)}>
            <div className="flex relative flex-col justify-end items-end w-full">
            <Link
                to={`/blog/view/${user.username}`}
                state= {{ background: location }}
                >
                <img src={user.avatar} 
                    onMouseOver={()=>setOpenView(true)} 
                    className="rounded"
                    style = {{
                        width: size,
                        height: size

                    }}/>
            </Link>
                {open_view && 
                    <div className="top-full mt-4 -right-24 absolute z-50 bg-white text-black w-72 rounded flex flex-col items-center">
                        <img src={user.background}  className="w-full h-36 rounded"/>
                        <img src={user.avatar} className="w-20 h-20 rounded-full absolute top-20 border-4 border-white"/>
                        {
                            me?.id != user.id && (
                                <div className='flex justify-between absolute top-3 right-3 text-white w-full items-center'>
                                    <div  className='font-medium text-lg text-white flex items-center ml-8'>
                                        <span>{user.follower_number}</span>
                                        <RiUserFollowLine/>
                                    </div>
                                    <BiMessageAltDetail onClick={getChat} className="w-6 h-auto cursor-pointer"/>
                                    <Follow user={user}/>
                                </div>
                            )
                        }
                    <div className='font-medium text-lg text-black mt-4 mb-3'>{user.username}</div>
                    <div className='flex mb-2'>
                        {
                            user.data.images.length >= 3? 
                                user.data.images.slice(user.data.images.length-3,user.data.images.length).map((item:any,index: number) => (
                                    <div key={index} className="px-1 rounded">
                                        <img src={item.url} style={{minWidth:80, minHeight:80, maxWidth:80,maxHeight:80}}/>
                                    </div>
                                ))
                            :user.data.images.map((item:any,index: number) => (
                                <div key={index} className=" px-1 rounded">
                                    <img src={item.url} style={{minWidth:80, minHeight:80, maxWidth:80,maxHeight:80}}/>
                                </div>
                            ))
                        }
                    </div>
                </div>}
            </div>
        </OutsideHoverDetect>
    )
}

export default Represent;