import {useEffect, useMemo, useState} from 'react';
import { BiMessageAltDetail } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';
import { Code, FRIEND, PUBLIC } from '../../Constants';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { ChatFunctions } from '../../store/chat/funtions';
import { MeHook } from '../../store/me/hooks';
import { RawUser } from '../../store/types';
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

const Represent = ({user, re_size}:{user: RawUser, re_size?:boolean })=>{
    const me = MeHook.useMe();
    const [open_view, setOpenView] = useState(false);
    const [follow_status, setFollowStatus] = useState(0);
    
    useEffect(()=>{
        if(me){
            console.log("FOLLOW",me.following);
            for(let i = 0 ; i < me.following.length ;++i){
                if(me.following[i].user_id == user.id){
                    setFollowStatus(me.following[i].status);
                    break;
                }
            }
        }
    },[me])

    const handleUnFollow = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/relationship/unfollow',{
                user_id: user.id
            });
            if(res.data && res.data.code == Code.SUCCESS){
                setFollowStatus(0);
            }   
            Toast.error(res.data.message);
        } catch (error) {
            Toast.error("ERROR");
        }
    }

    const handleFollow = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string,follow_status: number}>('/api/relationship/follow',{
                user_id: user.id
            });

            if(res.data && res.data.code == Code.SUCCESS){
                setFollowStatus(res.data.follow_status);
            }   
            Toast.error(res.data.message);
        } catch (error) {
            Toast.error("ERROR");
        }
    }

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
            <div className="flex relative flex-col justify-end items-end mr-8 w-full">
            <Link
                to={`/blog/view/${user.username}`}
                state= {{ background: location }}
                >
                <div className='mr-8'>
                    {
                        re_size ? <img src={user.avatar} onMouseOver={()=>setOpenView(true)} className="w-10 h-10 rounded"/>
                        :<img src={user.avatar} onMouseOver={()=>setOpenView(true)} className="w-16 h-16 rounded"/>
                    }
                </div>
            </Link>
                {open_view && 
                    <div className="top-full right-4 absolute z-50 bg-white text-black w-48 rounded-lg flex flex-col items-center">
                        <img src={user.background}  className="w-48 h-28 rounded"/>
                        <img src={user.avatar} className="w-12 h-auto rounded-full absolute top-20"/>
                        <div className='mt-4 font-medium text-lg'>{user.username}</div>
                        {
                            me?.id != user.id && (
                                <div className='flex justify-center'>
                                    <BiMessageAltDetail onClick={getChat} className="w-6 h-auto cursor-pointer"/>
                                    {
                                        follow_status == FRIEND ?  <button onClick={handleUnFollow}>UnFriend</button> 
                                            : follow_status == PUBLIC ? <button onClick={handleUnFollow}>UnFollow</button>
                                            : <button onClick={handleFollow}>Follow</button>
                                    }
                                </div>
                            )
                        }
                    <div>Follower {user.follower_number}</div>
                </div>}
            </div>
        </OutsideHoverDetect>
    )
}

export default Represent;