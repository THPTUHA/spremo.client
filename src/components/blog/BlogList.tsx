import {useAsync} from 'react-use'
import Fetch from '../../services/Fetch';
import { Helper } from "../../services/Helper";
import { RawLike, RawUser } from '../../store/types';
import {Code, BLOG_TYPES} from '../../Constants';
import { MeHook } from '../../store/me/hooks';
import { Toast } from '../../services/Toast';
import Diary from "../../components/diary/Diary";
import DrawView from "../../components/draw/DrawView";
import VoiceRecord from "../../components/voice.recorder/VoiceRecord";
import { useParams } from 'react-router-dom';

interface BlogResponse{
    blogs: any[],
    users: RawUser[],
    likes:RawLike[],
    blog_saved: number[],
    code: number,
    message: string,
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

const BlogList = ()=>{
    const me = MeHook.useMe();
    const {q} = useParams();

    const state = useAsync(async () => {
        console.log("E---",q);
        const res = await Fetch.postWithAccessToken<BlogResponse>('/api/blog/list', {
            q: q,
            user_id: me? me.id : 0
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message, blogs, users,likes,blog_saved} = res.data;
                console.log("BLOGS",blogs, users);
                if(code == Code.SUCCESS){
                    for(let i = 0;i< blogs.length ; ++i){
                        for(let j = 0; j < likes.length ; ++j){
                            if(blogs[i].id == likes[j].blog_id){
                                blogs[i].emotion_id = likes[j].emotion_id;
                                break;
                            }
                        }
                        for(let j = 0 ; j < users.length ; ++j){
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
                        blogs: blogs
                    }
                }
                Toast.error(message);
            }
        }

        return {
            blogs: []
        }
    }, [q,me]);
    
    return (
        <div>
            {
                state.loading ? <div>Loading....</div>:
                    state.value && state.value.blogs.map(blog => (
                        <div key={blog.id} className="w-1/2 mt-10">
                            {getTypeBlog(blog)}
                        </div>
                    ))
            }
        </div>
    )
}

export default BlogList;