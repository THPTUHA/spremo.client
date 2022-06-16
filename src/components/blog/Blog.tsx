import { Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { BLOG_TYPES } from "../../Constants";
import { StyleHook } from "../../store/style/hooks";
import {  RawBlog } from "../../store/types";
import DrawView from "../draw/DrawView";
import Music from "../music/Music";
import Note from "../note/Note";
import Post from "../post/Post";
import VoiceRecord from "../voice.recorder/VoiceRecord";
import BlogFooter from "./BlogFooter";
import BlogHeader from "./BlogHeader";
import Represent from "../user/Represent";
import TagEdit from "./TagEdit";

interface BlogProps{
    blog: RawBlog,
    my_blog?: boolean,
    layout_type?: number,
    setBlogs: Dispatch<SetStateAction<RawBlog[]>>
    setPage: Dispatch<SetStateAction<number>>
}

const getBlog = (blog: RawBlog)=>{
    switch(blog.type){
        case BLOG_TYPES.COMBINE:
            return <Post blog = {blog}/>
        case BLOG_TYPES.AUDIO:
            return <VoiceRecord blog={blog}/>
        case BLOG_TYPES.DRAW:
            return <DrawView blog={blog}/>
        case BLOG_TYPES.MUSIC:
            return <Music blog={blog}/>
        case BLOG_TYPES.NOTE:
            return <Note blog={blog}/>
    }
}

const Blog  = ({blog, setBlogs,setPage,layout_type,my_blog}:BlogProps)=>{
    const style = StyleHook.useStyle();
    return (
        <div className='w-full flex' style={{color:style.text_color}}>
            {/* {blog.user && (
                <div className="mr-8"><Represent user={blog.user}/></div>
            )} */}
            <div className='w-full rounded' style={{backgroundColor:style.bg_blog_color}}>
                <BlogHeader 
                    blog={blog} 
                    layout_type={layout_type}
                    setBlogs={setBlogs}
                    my_blog = {my_blog}
                />
                {getBlog(blog)}
                <TagEdit blog={blog}/>
                <BlogFooter blog={blog} setBlogs={setBlogs} setPage={setPage}/>
            </div>
        </div>
    )
}

export default Blog;