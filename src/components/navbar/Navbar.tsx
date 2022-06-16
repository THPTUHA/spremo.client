import {AiOutlineSearch} from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import {MeHook} from '../../store/me/hooks';
import {MeFunctions} from '../../store/me/functions';
import { BiAngry, BiHappyBeaming, BiSad } from 'react-icons/bi';
import { BiMessageAltDetail} from 'react-icons/bi';
import {MdNotifications, MdOutlineExplore} from 'react-icons/md';
import { BsPencil} from 'react-icons/bs';
import { EmotionHook } from "../../store/emotion/hooks";
import {EMOTION_IDS, ROLES} from "../../Constants";
import { EmtionFunctions } from "../../store/emotion/functions";
import { IoMdNotificationsOutline } from 'react-icons/io';
import { useState } from 'react';
import { useAsync } from 'react-use';
import firebase from 'firebase';
import Fetch from '../../services/Fetch';
import Modal from 'react-responsive-modal';
import { RawNotification } from '../../store/types';
import useNotificationLoadMore from '../../hooks/useNotificationLoadMore';
import OutsideClickDetect from '../ui/OutsideClickDetect';
import SearchItem from './SearchItem';
import { SocketHook } from '../../store/socket/hooks';
import { ChatFunctions } from '../../store/chat/funtions';
import ChatList from '../chat/ChatList';
import { MdHome} from 'react-icons/md';
import { StyleHook } from '../../store/style/hooks';
import { StyleFunctions } from '../../store/style/functions';
import { SettingFunctions } from '../../store/setting/function';
import Setting from '../setting/Setting';

const getEmotion = (status: number)=>{
    switch(status){
        case EMOTION_IDS.HAPPY:
            return (
                <ul className="feedback">
                    <li className="happy active" >
                        <div>
                            <svg className="eye left">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="eye right">
                                <use xlinkHref="#eye"/>
                            </svg>
                        </div>
                    </li>
                </ul>
            )
        case EMOTION_IDS.SAD:
            return (
                <ul className="feedback">
                    <li className="sad active">
                        <div>
                            <svg className="eye left">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="eye right">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="mouthsm">
                                <use xlinkHref="#mouthsm"/>
                            </svg>
                        </div>
                    </li>
                </ul>
            )
        case EMOTION_IDS.ANGRY:
            return (
                <ul className="feedback ">
                    <li className="angry active">
                        <div>
                            <svg className="eye left">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="eye right">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="mouthsm">
                                <use xlinkHref="#mouthsm"/>
                            </svg>
                        </div>
                    </li>
                </ul>
            )
        case EMOTION_IDS.OK:
            return (
                <ul className="feedback active">
                     <li className="ok active">
                        <div></div>
                    </li>
                </ul>
            )
        case EMOTION_IDS.GOOD:
            return (
                <ul className="feedback ">
                     <li className="good active">
                        <div>
                            <svg className="eye left">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="eye right">
                                <use xlinkHref="#eye"/>
                            </svg>
                            <svg className="mouthsm">
                                <use xlinkHref="#mouthsm"/>
                            </svg>
                        </div>
                    </li>
                </ul>
            )
    }
}

const Navbar = ()=>{
    const location = useLocation();
    const me = MeHook.useMe();
    const emotion = EmotionHook.useEmotion();
    const style = StyleHook.useStyle();

    useAsync(async()=>{
        if(me && me.role != ROLES.DEVELOPER){
            await EmtionFunctions.init();
        }
    },[me])

    useAsync(async()=>{
        if(emotion.id){
            await SettingFunctions.init(emotion.id);
        }
    },[emotion.id])
    
    const [open_notifi,setOpenNotifi] = useState(false);
    const [open_chat,setOpenChat] = useState(false);

    const [page, setPage] = useState(1);
    const page_size = 10;

    const {
        on_loading,
        notifications,
        has_more,
        setUnseen,
        unseen
    } = useNotificationLoadMore(page, page_size)

    useAsync(async()=>{
       if(open_notifi){
            const res = await Fetch.postWithAccessToken<{ unseen: number }>('/api/notification/unseen.get', {});
            if (res.status == 200) {
                setUnseen(res.data.unseen);
            }
       }
    },[open_notifi])

    return (
        <div className="bg-black fixed w-full z-50 top-0 py-2 border-b-[1px] border-gray-700" style={{color:style.text_color}}>
            <div className='flex justify-between relative'>
                <div className="flex ml-8 w-7/12 items-center">
                    <Link to="/">
                        <img src="/logo.png" className="w-10 h-10 rounded "/>
                    </Link>
                    <SearchItem/>
                </div>
                {
                    me ? (
                        <div className='flex items-center justify-between '>
                            <Setting is_on_navbar={true}/>
                            <div onClick={()=>EmtionFunctions.openModal()} className="cursor-pointer mr-2">
                                {me.role != ROLES.DEVELOPER && getEmotion(emotion.id)}
                                {me.role == ROLES.DEVELOPER && <img src={me.avatar} className="w-12 h-12 rounded"/>}
                                <svg xmlns="http://www.w3.org/2000/svg" style={{display: "none"}}>
                                    <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7 4" id="eye">
                                        <path d="M1,1 C1.83333333,2.16666667 2.66666667,2.75 3.5,2.75 C4.33333333,2.75 5.16666667,2.16666667 6,1"></path>
                                    </symbol>
                                    <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 7" id="mouthsm">
                                        <path d="M1,5.5 C3.66666667,2.5 6.33333333,1 9,1 C11.6666667,1 14.3333333,2.5 17,5.5"></path>
                                    </symbol>
                                </svg>
                            </div>
                            <Link to={`/blog/${me.username}`}>
                                <div className='cursor-pointer font-medium text-lg mr-3'>{me.username}</div>
                            </Link>
                            <Link to={`/`}>
                                <MdHome className={`${location.pathname === "/" ? '' : 'opacity-50 '}w-8 h-auto mr-4 cursor-pointer`}/>
                            </Link>
                            <div>
                                <BiMessageAltDetail onClick={()=>{setOpenChat(!open_chat);setOpenNotifi(false);}} 
                                    className={`${open_chat? '' : 'opacity-50 '} w-8 h-auto mr-4 cursor-pointer`}/>
                                {
                                    open_chat && (
                                        <div className='w-1/4 fixed right-0 mr-10 rounded' style={{backgroundColor:style.bg_blog_color}}>
                                            <OutsideClickDetect outsideFunc={() => setOpenChat(!open_chat)}>
                                                <ChatList/>
                                            </OutsideClickDetect>
                                        </div>
                                    )
                                }
                            </div>
                           
                           <Link to={me?"/explore/recommended-for-you": "/explore/trending"}>
                               <div className={`${location.pathname === "/explore/trending" ? '' : 'opacity-50 '} mr-2`} >
                                    <MdOutlineExplore className='w-8 h-auto'/>
                               </div>
                           </Link>
                            {/* <div onClick={handleLogOut}>Logout</div> */}
                            <div className="relative mr-5">
                                <a className="relative cursor-pointer" onClick={()=>{setOpenNotifi(!open_notifi); setOpenChat(false)}}>
                                    <span 
                                        className={`${open_notifi? '' : 'opacity-50 '} flex items-center justify-center px-2 py-1.5 text-lg rounded-lg`}
                                    ><MdNotifications className='w-8 h-auto'/></span>
                                    {(unseen > 0) && <span className="absolute -top-2 -right-2 text-white font-medium bg-red-700 text-sm flex justify-center items-center w-6 h-6 rounded-full">
                                        {unseen }</span>}
                                </a>
                            </div>
                            <Link
                                to={`/new`}
                                state= {{ background: location }}
                                onClick={()=>{StyleFunctions.setLocaion(location)}}
                            >
                                <button className='bg-blue-400 flex justify-center rounded w-14 px-2 py-2 mr-5'>
                                    <BsPencil className='w-6 h-auto'/>
                                </button>
                            </Link>
                        </div>
                        ) 
                        :(
                        <div className="flex mr-4">
                            <Link to="/explore/trending">
                               <div className={`${location.pathname === "/explore/trending" ? '' : 'opacity-50 '} mr-2`} >
                                    <MdOutlineExplore className='w-8 h-auto'/>
                               </div>
                           </Link>
                            {
                                // location.pathname == "/authentication/register" &&
                                <Link to="/authentication/login">
                                    <button className='h-9 px-3 bg-green-500 font-medium rounded' >Log in</button>
                                </Link>
                            }
                            {
                                // location.pathname == "/authentication/login" &&
                                <Link to="/authentication/register">
                                    <button className='h-9 px-3 bg-blue-500 font-medium rounded'>Sign up</button>
                                </Link>
                            }
                        </div>
                    )
                }
                
            </div>
            {
                open_notifi && (
                    <div className='w-1/4 fixed right-0 mr-10 rounded' style={{backgroundColor:style.bg_blog_color}}>
                        <OutsideClickDetect outsideFunc={() => setOpenNotifi(!open_notifi)}>
                        {
                            <div className='py-2 ml-5'>
                            {
                                on_loading ? <div>Loding...</div>:
                                        notifications.map((notifi)=>(
                                            <div key={notifi.id} className="py-2">
                                                <Link to={notifi.link}>
                                                    <div className='flex items-center'>
                                                        {notifi.from_avatar && <img className='w-10 h-10 rounded-full' src={notifi.from_avatar}/>}
                                                        <div className='flex ml-3 flex-col'>
                                                            {/* <div>{notifi.from_name}</div> */}
                                                            <div dangerouslySetInnerHTML={{__html: notifi.content}}></div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </div>
                                        ))
                            }
                            </div>
                        }
                    </OutsideClickDetect>
                    </div>
                )
            }
        </div>
    )
}

export default Navbar;