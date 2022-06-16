import { Dispatch, SetStateAction, useLayoutEffect, useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import Modal from "react-responsive-modal";
import {useNavigate, useParams} from 'react-router-dom'
import { useAsync } from "react-use";
import { BLOG_LIST_LAYOUT, BLOG_TYPES, Code, FRIEND, PUBLIC } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { RawUser } from "../../store/types";
import { ChatFunctions } from '../../store/chat/funtions';
import Follow from "../actionUser/Follow";
import Loading from "../loading/Loading";
import BlogList from "./BlogList";
import { AiOutlineClose } from "react-icons/ai";

interface Response{
    code: number,
    message: string,
    blogs: any[],
    user: RawUser,
    users: RawUser[],
    is_follow: boolean,
    is_friend: boolean
}


const ProfileModal = ()=>{
    const navigate = useNavigate();
    const {username} = useParams();
    const me = MeHook.useMe();
    const [user, setUser] = useState<RawUser>();

    const state = useAsync(async()=>{
        const url = me ? '/api/user/profile' : "/api/blog/profile";

        try {
            const res = await Fetch.postJsonWithAccessToken<Response>(url,{
                username: username
            });

            if(res.data){
                const {code,message, blogs, users,user, is_follow, is_friend} = res.data;
                if(code == Code.SUCCESS ){
                    if(me){
                        user.is_friend = is_friend;
                        user.is_follow = is_follow;

                        setUser(user);
                    }
                }

            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
    },[me,username])

    const getChat = async()=>{
		if(me&& user){
		    await ChatFunctions.get(user.id, me);
		}
	}

    useLayoutEffect(()=>{
        const body = document.getElementsByTagName("body");
        body[0].style.overflow = "hidden";
        return ()=>{
            body[0].style.overflow = "";
        }
    },[])

    return (
        <div className="fixed top-0 left-0" 
        style={{
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex:900,
            height: "100vh",
            width: "100vw"
        }}>
       <div className="fixed top-0 left-0 overflow-x-hidden"
            style={{
                zIndex:900,
                height: "100%",
                width: "100%",
            }}
       >
        <div className="relative flex items-center flex-col mt-10 mb-10 w-full">
            {state.loading && <Loading/>}
            <div className="w-4/5 flex">
                <div>
                    <AiOutlineClose className="w-10 h-auto text-white ml-5 cursor-pointer"
                                    onClick={()=>{navigate(-1)}}
                            />
                </div>
                {
                    !state.loading && user && (
                        <div className="flex w-11/12  bg-gray-800 text-white px-2 py-2 rounded-lg">
                            <div className="flex justify-center relative flex-col  items-center w-full px-1 border-r-[1px] border-gray-400">
                                <img src ={user.background} className="w-full h-64 rounded-t-lg"/>
                                <img src ={user.avatar} className="w-32 h-32 border-[6px] border-white absolute rounded-full top-44"/>
                                <div className="font-medium text-2xl mt-12 mb-5">{user.username}</div>
                                {
                                    me?.id != user.id && (
                                        <div className="flex mb-5 items-center">
                                            <BiMessageAltDetail onClick={getChat} className="w-10 h-auto mr-3 cursor-pointer"/>
                                            <div className="font-medium h-5 border-l-2 border-black"></div>
                                            <div >
                                                <Follow user={user}/>
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="w-5/6 mt-15 ml-14">
                                    <BlogList
                                        url={"/api/blog/list"}
                                        option={"view"}
                                        layout_type={BLOG_LIST_LAYOUT.VERTICAL}
                                        data = {{
                                            username: username
                                        }}
                                        my_blog = {true}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-wrap w-1/2 items-start ml-2' style={{
                                maxHeight: 250
                            }}>
                                {
                                    user.data.images.length >= 6? 
                                        user.data.images.slice(user.data.images.length-6,user.data.images.length).map((item:any,index: number) => (
                                            <div key={index} className="w-1/3 shadow">
                                                <img src={item.url} style={{minHeight:110, minWidth:110, maxHeight:110, maxWidth:110}} className=" rounded border-[1px] border-gray-800"/>
                                            </div>
                                        ))
                                    :user.data.images.map((item:any,index: number) => (
                                        <div key={index} className="w-1/3 shadow ">
                                            <img src={item.url} style={{minHeight:110, minWidth:110, maxHeight:110, maxWidth:110}} className="rounded border-[1px] border-gray-800"/>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    )
                }
                </div>
            </div>
       </div>
    </div>
    )
}

export default ProfileModal;