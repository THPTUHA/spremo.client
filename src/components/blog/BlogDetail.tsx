import Modal from "react-responsive-modal";
import { useNavigate, useParams } from "react-router-dom";
import { useAsync } from "react-use";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawUser } from "../../store/types";
import Content from "../diary/Content";
import Diary from "../diary/Diary";
import DiaryDetail from "../diary/DiaryDetail";
import DrawView from "../draw/DrawView";
import VoiceRecord from "../voice.recorder/VoiceRecord";
import LoadingNormal from "../loading/LoadingNormal";
import DrawViewModal from "../draw/DrawViewModal";
import VoiceModal from "../voice.recorder/VoiceModal";

interface Response{
    code: number,
    message: string,
    blogs: any[],
    blog: any,
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

const BlogDetail = ()=>{
    const {id} = useParams();
    const navigative = useNavigate();
    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>("/api/blog/detail",{
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
            onClose={()=>{navigative(-1)}} open={true}>
            <div className="w-full">
                {
                    state.loading ? <LoadingNormal/>
                        : state.value && (
                            <div>
                                {getDetailBlog(state.value.blog)}
                                <div>
                                    <div>More like this</div>
                                    <div>
                                        {
                                            state.value.blogs.map(blog => (
                                                <div key={blog.id}>
                                                    {getTypeBlog(blog)}
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>
        </Modal>
        </>
    )
}

export default BlogDetail;