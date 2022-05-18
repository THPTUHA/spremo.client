import { useParams } from "react-router-dom";
import { useAsync } from "react-use";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawUser } from "../../store/types";
import Diary from "../diary/Diary";
import DrawView from "../draw/DrawView";
import VoiceRecord from "../voice.recorder/VoiceRecord";

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

const Profile = ()=>{
    const {username} = useParams();

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/blog/profile",{
                username: username
            });

            if(res.data){
                const {code,message, blogs, users,owner} = res.data;
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

    return (
        <div>
            {
                state.loading ? <div>Loading...</div>
                    : state.value && (
                        <div>
                            <div>{state.value.owner.username}</div>
                            <img src ={state.value.owner.avatar}/>
                            <div>
                                {state.value.blogs.map(blog =>(
                                    <div key={blog.id}>{getTypeBlog(blog)}</div>
                                ))}
                            </div>
                        </div>
                    )
            }
            <div>Hello world!</div>
        </div>
    )
}
export default Profile;