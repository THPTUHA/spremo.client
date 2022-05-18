import { AiOutlineVideoCamera } from "react-icons/ai";
import { MdOutlineAddAPhoto, MdOutlineDraw, MdOutlineSettingsVoice, MdOutlineTextFields } from "react-icons/md";
import { Link, Route, useNavigate, Routes } from "react-router-dom";
import { MeHook } from "../../../store/me/hooks";
import {useAsync} from 'react-use';
import Fetch from "../../../services/Fetch";
import Diary from "../../../components/diary/Diary";
import { Code } from "../../../Constants";
import { Toast } from "../../../services/Toast";
import Modal from "react-responsive-modal";
import { useState } from "react";
import VoiceRecorderEdit from "../../../components/voice.recorder/VoiceRecorderEdit";
import {BLOG_TYPES, ROLES} from "../../../Constants";
import VoiceRecord from "../../../components/voice.recorder/VoiceRecord";
import DrawView from "../../../components/draw/DrawView";
import { DrawFunctions } from "../../../store/draw/functions";
import { EmotionHook } from "../../../store/emotion/hooks";
import { voiceRecoderHook } from "../../../store/voice.recorder/hooks";
import { VoiceRecoderFunction } from "../../../store/voice.recorder/functions";
import { StyleHook } from "../../../store/style/hooks";
import { RawLike, RawUser } from "../../../store/types";
import { MeFunctions } from "../../../store/me/functions";
import { ChatFunctions } from "../../../store/chat/funtions";
import { SocketHook } from "../../../store/socket/hooks";
import { Helper } from "../../../services/Helper";

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

interface BlogResponse{
	code: number,
	message: string,
	blogs: any,
	likes:RawLike[],
	users: RawUser[],
    blog_saved: number[]
}

const MyBlog = ()=>{
    const me = MeHook.useMe();
    const navgate = useNavigate();
    const emotion = EmotionHook.useEmotion();
    
    const is_open = voiceRecoderHook.useIsOpen();
    const reset = StyleHook.useReset();
    const style = StyleHook.useStyle();
    const socket = SocketHook.useSocket();

    const [option, setOption] = useState("");

    const createDraw = async()=>{
        if(!me) return;
        const blog = await DrawFunctions.create(emotion.id);
        if(blog && blog.id){
            navgate(`../edit/${me.username}/${blog.id}`)
        }
    }
    
    const handleLogOut = ()=>{
        MeFunctions.logout();
        socket.disconnect()
        ChatFunctions.close();
    }

    const blog_data = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<BlogResponse>('/api/me/blog.list',{
                ...Helper.getURLParams(),
                my_blog: true,
                option: option
            });
            
            if(res.data && res.data.code == Code.SUCCESS){
                const { blogs,likes,users,blog_saved} = res.data;
                for(let i = 0; i < blogs.length; ++i){
                    blogs[i].is_edit = true;
                    for(let j = 0; j < likes.length ; ++j){
                        if(blogs[i].id == likes[j].blog_id){
                            blogs[i].emotion_id = likes[j].emotion_id;
                            break;
                        }
                    }
                    for(let j = 0; j < users.length ; ++j){
                        if(blogs[i].user_id == users[j].id){
                            blogs[i].user = users[j];
                            break;
                        }
                    }
                    for(let j = 0 ; j < blog_saved.length ; ++j){
                        if(blogs[i].id == blog_saved[j]){
                            blogs[i].is_marked = true;
                            break;
                        }
                    }
                }
                return {
                    blogs: res.data.blogs
                }
            }
            Toast.error(res.data.message);
        } catch (error) {
            console.log(error);
            Toast.error("ERROR");
        }
        return {
            blogs: []
        }
    },[Helper.setAndGetURLParam([]),reset,option]);
    
    return (
     <div className="mt-5 mb-20 flex w-full">
        <div className="w-1/2 ml-40">
            <div className="flex w-full justify-around mb-5 py-2 w-full">
                <Link to={`/new/text`}>
                    <div className="flex-col items-center cursor-pointer">
                        <MdOutlineTextFields className="h-10 w-auto" style={{color: style.text_tool__color}}/>
                        <div>Text</div>
                    </div>
                </Link>
                <div onClick={createDraw} className="flex-col items-center cursor-pointer">
                    <MdOutlineDraw className="h-10 w-auto"  style={{color: style.draw_tool_color}}/>
                    <div>Draw</div>
                </div>
                <div onClick={()=>{VoiceRecoderFunction.open("",true,0)}} className="flex-col items-center cursor-pointer">
                    <MdOutlineSettingsVoice className="h-10 w-auto"  style={{color: style.voice_tool_color}}/>
                    <div>Voice</div>
                </div>
                {/* <div className="flex-col items-center cursor-pointer">
                    <MdOutlineAddAPhoto className="h-10 w-auto"/>
                    <div>Photo</div>
                </div>
                <div className="flex-col items-center cursor-pointer mr-10">
                    <AiOutlineVideoCamera className="h-10 w-auto"/>
                    <div>Video</div>
                </div> */}
            </div>
            {
                blog_data.loading ? <div>FUCK....</div> : (
                    <>
                        {
                            blog_data.value &&  blog_data.value.blogs.map((blog: any)=>(
                                <div key={blog.id}>
                                    {getTypeBlog(blog)}
                                </div>
                            ))
                        }
                    </>
                )
            }
        </div>
        <div className="w-1/4 flex flex-col ml-20 mt-24">
                {
                    me?.role == ROLES.ADMIN && (
                        <Link to={`/admin/users`}>
                            <div className="border-b-[1px] border-white mb-3">Admin</div>
                        </Link>
                    )
                }
                <Link to={`/settings/blog/${me?.username}`}>
                    <div className="border-b-[1px] border-white mb-3">Settings</div>
                </Link>
                {
                    me?.role == ROLES.CENSOR && (
                        <Link to={`/censor/blog/${me?.username}`}>
                            <div className="border-b-[1px] border-white mb-3">Censor</div>
                        </Link>
                    )
                }
                <div className="border-b-[1px] border-white mb-3">
                    <Link to={`/active/blog/${me?.username}`}>
                        <div >Active</div>
                    </Link>
                </div>
                {/* {
                    me?.role == ROLES.DEVELOPER && (
                        <div className="ml-20 w-1/3 ">
                            <Link to={`/active/blog/${me?.username}`}>
                                <div >Active</div>
                            </Link>
                        </div>
                    )
                } */}
                <div className="cursor-pointer border-b-[1px] border-white mb-3" onClick={()=>{setOption("mark")}}>
                    Markbook
                </div>
                <div className="cursor-pointer border-b-[1px] border-white mb-3" onClick={handleLogOut}>
                    Logout
                </div>
            </div>
     </div>   
    )
}

export default MyBlog;