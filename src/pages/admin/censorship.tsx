import {useAsync} from 'react-use'
import Fetch from '../../services/Fetch';
import { Helper } from "../../services/Helper";
import { RawLike, RawUser } from '../../store/types';
import {Code, BLOG_TYPES, ROLES} from '../../Constants';
import { MeHook } from '../../store/me/hooks';
import { Toast } from '../../services/Toast';
import Diary from "../../components/diary/Diary";
import DrawView from "../../components/draw/DrawView";
import VoiceRecord from "../../components/voice.recorder/VoiceRecord";
import { useParams } from 'react-router-dom';
import { StyleHook } from '../../store/style/hooks';
import {useState} from 'react';

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
    blogs: any[],
    users: RawUser[],
    likes:RawLike[],
    code: number,
    message: string
}

const OPTIONS = [
    {id: 1, value: "picked", lable:"Picked"},
    {id: 2, value: "banned", lable:"Banned"},
]

const AdminBlogs = ()=>{
    const me = MeHook.useMe();
    const reset = StyleHook.useReset();
    const [option, setOption] = useState<string>();

    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<BlogResponse>('/api/blog/list', {
            user_id: me? me.id : 0,
            option: option
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message, blogs, users,likes} = res.data;
                if(code == Code.SUCCESS){
                    for(let i = 0;i< blogs.length ; ++i){
                        if(me?.role == ROLES.ADMIN || me?.role == ROLES.CENSOR){
                            blogs[i].is_censored = true;
                        }

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
    }, [me,reset,option]);

    return (
        <div className="w-full ml-5 flex">
           <div className='w-2/3'>
                {
                    state.loading ? <div>Loading....</div>:
                        state.value && state.value.blogs.map(blog => (
                            <div key={blog.id} className="mt-10">
                                {getTypeBlog(blog)}
                            </div>
                        ))
                }
           </div>
           <div className='w-1/4 bg-red-500 ml-10'>
                {
                    OPTIONS.map(option => (
                        <div key={option.id} onClick={()=>{setOption(option.value)}} className="cursor-pointer">
                            <div>{option.lable}</div>
                        </div>
                    ))
                }
           </div>
        </div>
    )
}

export default AdminBlogs;