import Modal from "react-responsive-modal";
import {useCallback, useRef, useState} from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawUser, RawBlog } from "../../store/types";
import DiaryDetail from "../post/PostDetail";
import LoadingNormal from "../loading/LoadingNormal";
import DrawViewModal from "../draw/DrawViewModal";
import VoiceModal from "../voice.recorder/VoiceModal";
import Blog from './Blog';
import Horizontal from "./layout/Horizontal";

interface Response{
    code: number,
    message: string,
    blogs: any[],
    blog: any,
    users: RawUser[]
}

const getDetailBlog = (blog: any)=>{
    switch(blog.type){
        case BLOG_TYPES.COMBINE:
            return <DiaryDetail blog = {blog}/>
        case BLOG_TYPES.AUDIO:
            return <VoiceModal audio={blog}/>
        case BLOG_TYPES.DRAW:
            return <DrawViewModal draw={blog}/>
    }
}

const BlogDetail = ({url}:{url: string})=>{
    const {id} = useParams();
    const navigative = useNavigate();
    const [blogs, setBlogs] = useState<RawBlog[]>([]);

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>(url,{
                id: id
            });

            if(res.data){
                const {code,message, blogs, users,blog} = res.data;
                for(let i = 0;i< blogs.length ; ++i){
                    for(let j = 0 ; j < users.length ; ++j){
                        if(blogs[i].user_id == users[j].id){
                            blogs[i].user = users[j];
                            break;
                        }
                    }
                }
                if(code == Code.SUCCESS){
                    return {
                        blogs: blogs,
                        users: users,
                        blog: blog
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
            blog: {} as any
        }
    },[id])

    return (
        <>
            <Modal
            showCloseIcon = {false}
            classNames={{
                modal: "rounded-lg overflow-x-hidden w-1/2 relative"
            }}
            center
            onClose={()=>{navigative(-1)}} open={true}
            styles = {{
                modal: {
                    backgroundColor: "transparent",
                }
            }}
            >
            {/* <div className="w-full">
                {
                    state.loading ? <LoadingNormal/>
                        : state.value && (
                            <div>
                                {getDetailBlog(state.value.blog)}
                                <div className="w-full">
                                    <div>More like this</div>
                                    <Horizontal 
                                        blogs={state.value.blogs}
                                        lastBlogElementRef ={lastBlogElementRef}
                                    /> 
                                </div>
                            </div>
                        )
                }
            </div> */}
        </Modal>
        </>
    )
}

export default BlogDetail;