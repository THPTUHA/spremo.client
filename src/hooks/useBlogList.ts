import { useState ,useRef} from "react";
import { useAsync } from "react-use";
import { Code ,ROLES,PRIVATE} from "../Constants";
import Fetch from "../services/Fetch";
import { Helper } from "../services/Helper";
import { Toast } from "../services/Toast";
import { MeHook } from "../store/me/hooks";
import { RawBlog, RawLike, RawUser } from "../store/types";
import * as _ from 'lodash';
import { useParams } from "react-router-dom";
import { EmotionHook } from "../store/emotion/hooks";
import {StyleHook} from '../store/style/hooks';

interface BlogResponse{
    blogs: RawBlog[],
    users: RawUser[],
    likes: RawLike[],
    bookmarks: number[],
    blog_number: number,
    blog_viewed: number[],
    code: number,
    message: string,
}

const page_size = 5;
const useBlogList = (url: string, option?: string, data?: any)=>{
    const me = MeHook.useMe();
    const emotion = EmotionHook.useEmotion();
    const reset = StyleHook.useReset();
    const [blog_list, setBlogList] = useState<RawBlog[]>([]);
    const [page, setPage] = useState(1);
    const [blog_number, setBlogNumber] = useState(0);

    const blog_viewed_ref = useRef<number[]>([]);
    const emotion_ref = useRef(0);
    const option_ref = useRef("");
    const reset_ref = useRef<any>(2);
    const params = useParams();

    const state = useAsync(async () => {
        console.log("URL",url,option);
        if(reset_ref.current != reset){
            if(page!=1){
                setPage(1);
                return;
            }
        }
        let payload =  {
            ...Helper.getURLParams(),
            ...params,
            page: page,
            page_size,
            emotion_id: emotion.id,
            blog_viewed: JSON.stringify(blog_viewed_ref.current),
            option:option
        }

        if(data){
            payload = {
                ...payload,
                ...data
            }
        }

        console.log("Payload",payload )
        const res = await Fetch.postJsonWithAccessToken<BlogResponse>(url,payload);

        if (res.status == 200) {
            if (res.data) {
                const {code,message, blogs, users,likes,bookmarks, blog_number,blog_viewed} = res.data;
                if(code == Code.SUCCESS){
                    for(const blog of blogs){
                        for(const like of likes){
                            if(blog.id == like.blog_id){
                                blog.emotion_id = like.emotion_id;
                                break;
                            }
                        }
                        for(const user of users){
                            if(blog.user_id == user.id){
                                blog.user = user;
                                break;
                            }
                        }
                        for(const bookmark of bookmarks){
                            if(blog.id == bookmark){
                                blog.is_marked = true;
                                break;
                            }
                        }
                        if(me && me.role == ROLES.ADMIN && blog.status != PRIVATE && url.includes("admin")){
                            blog.is_censored = true;
                        }
                        if(option == "my-blog"){
                            blog.is_edit = true;
                            blog.allow_delete = true;
                        }
                    }
                    blog_viewed_ref.current = blog_viewed;

                    // blog_list[blog_list.length-1].is_last = false;
                    console.log("BLOG__2",blogs);
                    if(emotion_ref.current != emotion.id || (option_ref.current && option_ref.current!=option) || (reset_ref.current != reset)){
                        if(blogs.length){
                             blogs[blogs.length - 1].is_last = true;
                        }
                        setBlogList(blogs);
                    }else{
                        blog_list[blog_list.length - 1].is_last = false;
                        const temp = _.unionBy(blog_list, blogs, x => x.id);
                        temp[temp.length - 1].is_last = true;
                        setBlogList(temp);
                    }

                    console.log("Number",blog_number);
                    reset_ref.current = reset;
                    option_ref.current = option? option: "";
                    emotion_ref.current = emotion.id;
                    setBlogNumber(blog_number);

                    return {
                        blog_number
                    }
                }
                Toast.error(message);
            }
        }

        return {
            blog_number: 0,
            blogs: []
        }
    }, [Helper.setAndGetURLParam([]),me,option,page, emotion.id, reset]);

    return {
        loading: state.loading,
        blogs: blog_list,
        load_more: blog_number > page_size*page ,
        setBlogs: setBlogList,
        setPage: setPage
    }
}

export default useBlogList;