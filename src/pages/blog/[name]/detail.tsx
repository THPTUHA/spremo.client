import Modal from "react-responsive-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import Blog from "../../../components/blog/Blog";
import BlogList from "../../../components/blog/BlogList";
import Loading from "../../../components/loading/Loading";
import { BLOG_LIST_LAYOUT, Code } from "../../../Constants";
import Fetch from "../../../services/Fetch";
import { Toast } from "../../../services/Toast";
import { RawBlog,RawUser } from "../../../store/types";
import {MeHook} from "../../../store/me/hooks";
import { useLayoutEffect } from "react";
import { GiCancel } from "react-icons/gi";

interface Response{
    code: number,
    message: string,
    user: RawUser,
    blog: RawBlog,
}

const BlogViewDetail = ()=>{
    const {id} = useParams();
    const me = MeHook.useMe();
    const navigate = useNavigate();

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/blog/detail",{
                id: id
            });

            if(res.data){
                const {code,message,blog, user} = res.data;
                if(code == Code.SUCCESS){
                    blog.user = user;
                    return {
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
            blog: {} as RawBlog
        }
    },[id])

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
                zIndex:1000,
                height: "100vh",
                width: "100vw"
            }}>
           <div className="fixed top-0 left-0 overflow-x-hidden"
                style={{
                    zIndex:1010,
                    height: "100%",
                    width: "100%",
                }}
           >
                <div className="relative flex items-center flex-col mt-10">
                    <div className="w-2/3 flex items-start">
                        <div className="w-9/12 flex justify-center">
                            {
                                state.loading ? <Loading/>
                                    : state.value && (
                                        <Blog
                                            blog={state.value.blog}
                                            setBlogs = {()=>{}}
                                            setPage = {()=>{}}
                                            layout_type = {BLOG_LIST_LAYOUT.VERTICAL}
                                        />
                                    )
                            }
                        </div>
                        <GiCancel className="w-10 h-auto text-white ml-5 cursor-pointer"
                                onClick={()=>{navigate(-1)}}
                        />
                    </div>
                    <div className="text-2xl text-white py-6">More like this</div>
                    <div className="w-full flex justify-center px-10">
                        <BlogList
                            url = {me ? "/api/blog/auth.similar" :"/api/blog/similar"}
                            layout_type = {BLOG_LIST_LAYOUT.HORIZONTAL}
                            data = {{
                                id : id
                            }}
                        />
                    </div>
                </div>
           </div>
        </div>
    )
}

export default BlogViewDetail;