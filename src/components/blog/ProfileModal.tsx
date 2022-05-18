import { useState } from "react";
import { BiMessageAltDetail } from "react-icons/bi";
import Modal from "react-responsive-modal";
import {useNavigate, useParams} from 'react-router-dom'
import { useAsync } from "react-use";
import { BLOG_TYPES, Code, FRIEND, PUBLIC } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { RawUser } from "../../store/types";
import Diary from "../diary/Diary";
import DrawView from "../draw/DrawView";
import VoiceRecord from "../voice.recorder/VoiceRecord"
import { ChatFunctions } from '../../store/chat/funtions';

interface Response{
    code: number,
    message: string,
    blogs: any[],
    owner: RawUser,
    users: RawUser[]
}


const getTypeBlog = (blog: any)=>{
    switch(blog.type){
        case BLOG_TYPES.COMBINE:
            return <Diary blog = {blog}/>
        case BLOG_TYPES.AUDIO:
            return <VoiceRecord audio={blog}/>
        case BLOG_TYPES.DRAW:
            return <DrawView draw={blog}/>
    }
}


const ProfileModal = ()=>{
    const [open,setOpen] = useState(true);
    const navigative = useNavigate();
    const {username} = useParams();
    const me = MeHook.useMe();
    const [follow_status, setFollowStatus] = useState(0);

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/blog/profile",{
                username: username
            });

            if(res.data){
                const {code,message, blogs, users,owner} = res.data;
                let follow = 0;
                for(let i =0 ; i< owner.friends.length; ++i){
                    if(owner.friends[i].user_id == me?.id){
                        follow = FRIEND; break;
                    }
                }
                if(!follow){
                    for(let i =0 ; i< owner.following.length; ++i){
                        if(owner.following[i].user_id == me?.id){
                            follow = PUBLIC; break;
                        }
                    }
                }

                setFollowStatus(follow)
                // for(let i = 0; i< blogs.length ; ++i){
                //     blogs[i].user = owner;
                // }
                if(code == Code.SUCCESS){
                    return {
                        blogs: blogs,
                        users: users,
                        owner: owner
                    }
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
        return {
            blogs: [],
            users: [],
            owner: {} as RawUser
        }
    },[])

    const getChat = async()=>{
		if(me && state.value){
		    await ChatFunctions.get(state.value.owner.id, me);
		}
	}

    const handleUnFollow = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/relationship/unfollow',{
                user_id: state.value? state.value.owner.id: 0
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
                user_id: state.value? state.value.owner.id: 0
            });

            if(res.data && res.data.code == Code.SUCCESS){
                setFollowStatus(res.data.follow_status);
            }   
            Toast.error(res.data.message);
        } catch (error) {
            Toast.error("ERROR");
        }
    }

    return (
        <Modal
            showCloseIcon = {false}
            classNames={{
                modal: "rounded-lg overflow-x-hidden w-2/3 relative"
            }}

            onClose={()=>{navigative(-1)}} open={true}>
            <>
            <div>
                {
                    state.loading ? <div>Loading...</div>
                        : state.value && (
                            <div className="flex justify-center relative flex-col -m-[19px] items-center w-full">
                                <img src ={state.value.owner.background} className="w-full h-64 rounded"/>
                                <img src ={state.value.owner.avatar} className="w-24 h-auto absolute rounded-full top-48"/>
                                <div className="font-medium text-2xl mt-10 mb-5">{state.value.owner.username}</div>
                                {
                                    me?.id != state.value.owner.id && (
                                        <div className="flex mb-5 items-center">
                                            <BiMessageAltDetail onClick={getChat} className="w-10 h-auto mr-3 cursor-pointer"/>
                                            <div className="font-medium h-5 border-l-2 border-black"></div>
                                            <div >
                                                {
                                                    follow_status == FRIEND 
                                                        ?  <button onClick={handleUnFollow} className="bg-green-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                                                            UnFriend
                                                            </button> 
                                                        : follow_status == PUBLIC 
                                                        ? <button onClick={handleUnFollow}  className="bg-green-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                                                            UnFollow
                                                            </button>
                                                        : <button onClick={handleFollow}  className="bg-green-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                                                            Follow
                                                            </button>
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                <div className="w-2/3 mt-15">
                                    {state.value.blogs.map(blog =>(
                                        <div key={blog.id}>
                                            {getTypeBlog(blog)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                }
            </div>
            </>
        </Modal>
    )
}

export default ProfileModal;