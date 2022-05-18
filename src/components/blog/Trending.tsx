import { useState } from "react";
import { useAsync } from "react-use";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawLike, RawUser } from "../../store/types";
import Diary from "../diary/Diary";
import DrawView from "../draw/DrawView";
import VoiceRecord from "../voice.recorder/VoiceRecord";
import { MeHook } from "../../store/me/hooks";

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
    blog_saved: number[],
	users: RawUser[]
}

const Trending = ()=>{
    const [blogs, setBlogs] = useState<any[]>([]);
    const me = MeHook.useMe();

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<BlogResponse>('/api/blog/trending',{
                user_id: me? me.id: 0
            })
            if(res.data){
                const {code, message,blogs,likes,users, blog_saved} = res.data;
                if(code == Code.SUCCESS){
                    console.log("BLOGS",blogs,users);
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
                    setBlogs(blogs);
                    return;
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }      
    },[me])

    return (
        <div className="w-full ">
            {
                state.loading ? <div>Loading...</div> : (
                    <div className="w-full">
                        {blogs.map(blog=>(
                            <div key={blog.id}>
                                {getTypeBlog(blog)}
                            </div>
                        ))}
                    </div>)
            }
        </div>
    )
}

export default Trending;