import { useParams } from "react-router-dom"
import { useAsync } from "react-use";
import Draw from "../../../components/draw/Draw";
import MusicEditor from "../../../components/music/MusicEditor";
import NoteEditor from "../../../components/note/NoteEditor";
import TextEditor from "../../../components/text.editor/TextEditor"
import VoiceRecorderEdit from "../../../components/voice.recorder/VoiceRecorderEdit";
import { BLOG_TYPES, Code } from "../../../Constants";
import Fetch from "../../../services/Fetch";
import { Helper } from "../../../services/Helper";
import { Toast } from "../../../services/Toast";
import {DrawFunctions}  from "../../../store/draw/functions";
import { RawBlog } from "../../../store/types";

const getContent = (blog: any)=>{
    switch(blog.type){
        case BLOG_TYPES.COMBINE:
            return <TextEditor blog={blog}/>
        case BLOG_TYPES.DRAW:
            return (
                <div className="-mt-10">
                    <Draw/>
                </div>
            )
        case BLOG_TYPES.MUSIC:
            return <MusicEditor blog={blog}/>
        case BLOG_TYPES.NOTE:
            return <NoteEditor blog={blog}/>
        case BLOG_TYPES.AUDIO:
            return <VoiceRecorderEdit blog={blog}/>
    }
}

const EditBlog = ()=>{
    const {id} = useParams();

    const state = useAsync(async()=>{
        if(id){  
            const q = Helper.getURLParams();
            const url = q.public ?"/api/blog/edit" :"/api/me/blog.get";

            try {
                const res = await Fetch.postJsonWithAccessToken<{code:number, message: string, blog: RawBlog}>(url,{
                    id: id
                })
                if(res.data){
                    const {code, message, blog} = res.data;
                    if(code == Code.SUCCESS){
                        blog.is_edit = true; 
                        console.log("BLOG---",blog);
                        if(blog.type == BLOG_TYPES.DRAW){
                            await DrawFunctions.init(blog);
                        }
                        return {
                            blog: blog
                        }
                    }
                    Toast.error(message);
                }
            } catch (error) {
                console.log(error);
                Toast.error("Emotional Damage!");
            }
        }
    },[id,Helper.setAndGetURLParam([])])
    
    return (
        <div>
            {
                state.loading ? <div>Loading...</div>: state.value?.blog &&
                    <>{getContent(state.value.blog)}</>
            }
        </div>
        
    )
}

export default EditBlog;