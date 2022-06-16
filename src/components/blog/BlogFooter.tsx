import { Link, useLocation } from "react-router-dom";
import { MeHook } from '../../store/me/hooks';
import Fetch from '../../services/Fetch';
import { BLOG_TYPES, Code, EMOTION_IDS, PRIVATE, SHARE_OPTIONS, ROLES, FRIEND_SPECIFIC, EMOTIONS, SELECTED, BAN } from '../../Constants';
import { Toast } from '../../services/Toast';
import { VoiceRecoderFunction } from "../../store/voice.recorder/functions";
import { StyleFunctions } from '../../store/style/functions';
import Modal from 'react-responsive-modal';
import { useState ,useEffect, useMemo, Dispatch, SetStateAction} from 'react';
import instanceFirebaseApp from '../../services/Firebase';
import {  RawBlog, RawComment, RawUser } from '../../store/types';
import { BsPencil } from "react-icons/bs";
import BanBlog from "../actionBlog/BanBlog";
import CommentBlog from "../actionBlog/CommentBlog";
import ShareBlog from "../actionBlog/ShareBlog";
import DropEmotionBlog from "../actionBlog/DropEmotionBlog";
import MarkBlog from "../actionBlog/MarkBlog";
import { FaRegComment } from "react-icons/fa";
import DeleteBlog from "../actionBlog/DeleteBlog";

interface Props{
    blog: RawBlog,
    setBlogs: Dispatch<SetStateAction<RawBlog[]>>
    setPage: Dispatch<SetStateAction<number>>
}

const BlogFooter = ({blog,setBlogs, setPage}: Props)=>{
    const me = MeHook.useMe();
    const location = useLocation();
    const [open_comment,setOpenComment] = useState(false);
    // useEffect(()=>{
    //     StyleFunctions.setLocaion(location);
    // },[])

    return (
        <div className="w-full">
            <div className='flex justify-between text-white items-center py-4 w-full border-t-[1px] border-gray-700 px-10'>
                {
                    blog.status == PRIVATE && me?.role != ROLES.DEVELOPER && 
                    <ShareBlog blog={blog}/>
                }
                <DropEmotionBlog blog={blog}/>
                <FaRegComment onClick={()=>{setOpenComment(!open_comment)}} className='w-6 h-auto cursor-pointer'/>
                {
                        me && me.id == blog.user_id && blog.is_edit && (
                           <Link 
                                to={`/edit/${me?.username}/${blog.id}`}
                                onClick={()=>{StyleFunctions.setLocaion(location)}}
                                >
                                <BsPencil className='w-6 h-auto cursor-pointer'/>
                            </Link>
                    )}
                {/* <MarkBlog blog={blog}/> */}
                {
                    blog.allow_delete && <DeleteBlog blog={blog} setBlogs={setBlogs}/>
                }
                {
                    blog.is_censored && <BanBlog blog={blog} setBlogs={setBlogs}/>
                }
            </div>
            {open_comment && <CommentBlog blog={blog}/>}
        </div>
    )
}

export default BlogFooter;