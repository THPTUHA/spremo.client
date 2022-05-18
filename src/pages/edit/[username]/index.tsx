import { useParams } from "react-router-dom"
import { useAsync } from "react-use";
import Draw from "../../../components/draw/Draw";
import TextEditor from "../../../components/text.editor/TextEditor"
import { BLOG_TYPES, Code } from "../../../Constants";
import Fetch from "../../../services/Fetch";
import { Helper } from "../../../services/Helper";
import { Toast } from "../../../services/Toast";
import {DrawFunctions}  from "../../../store/draw/functions";
import {VoiceRecoderFunction} from "../../../store/voice.recorder/functions";

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
    }
}

const EditBlog = ()=>{
    const {id} = useParams();

    const state = useAsync(async()=>{
        if(id){  
            const q = Helper.getURLParams();
            const url = q.public ?"/api/blog/edit" :"/api/me/blog.get";

            try {
                const res = await Fetch.postJsonWithAccessToken<{code:number, message: string, blog: any}>(url,{
                    id: id
                })
                if(res.data){
                    const {code, message, blog} = res.data;
                    if(code == Code.SUCCESS){
                        if(blog.type == BLOG_TYPES.DRAW){
                            DrawFunctions.init(blog);
                        } 
                        return {
                            blog: blog
                        }
                    }
                    Toast.error(message);
                }
            } catch (error) {
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