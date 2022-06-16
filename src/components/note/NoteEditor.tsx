import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { StyleFunctions } from "../../store/style/functions";
import { StyleHook } from "../../store/style/hooks";
import { RawBlog, RawNote } from "../../store/types";
import TagEdit from "../blog/TagEdit";
import { createReactEditorJS } from 'react-editor-js';

//@ts-ignore
import List from '@editorjs/list'
//@ts-ignore
import Image from '@editorjs/image'
//@ts-ignore
import Header from '@editorjs/header'
//@ts-ignore
import Quote from '@editorjs/quote'
import Modal from "react-responsive-modal";

const ReactEditorJS = createReactEditorJS();

const uploadImg =async (file:any) => {
    console.log("FILE.......",file);
    const res = await Fetch.postWithAccessToken<{url: string}>('/api/upload/img',{
        image: file
    });
    console.log("Res",res);
    return {
        success: 1,
        file: {
          url: res.data.url
        }
      };
}

const TOOLS = {
    list: List,
    image: {
        class: Image,
        config: {
            uploader:{
                uploadByFile(file: any){
                    return uploadImg(file);
                }
            },
        }
    },
    header: Header,
    quote: Quote,
}

const NoteEditor = ({blog}: {blog: RawBlog})=>{
    const editorCore = useRef<any>(null);
    const navigate = useNavigate()
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();
    const location = StyleHook.useLocation();
    
    const [title, setTitle] = useState((blog.data as RawNote).title );

    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance;
    }, [])

    const handleCancel = ()=>{
        navigate(location.pathname)
    }


    const handleSave =  useCallback(async(external: any) => {
        const saved_data = await editorCore.current.save();

        let data = {
            data: JSON.stringify({
                ...saved_data,
                title: title
            }),
            id: blog.id,
            type: BLOG_TYPES.NOTE
        }

        if(external){
            data = {
                ...data,
                ...external
            }
        }
        
        const url = blog.id ? '/api/me/blog.update' : '/api/me/blog.create';

        const res  = await Fetch.postJsonWithAccessToken<{code: number, message: string}>(url,data);
    
        if(res.data.code == Code.SUCCESS){
            Toast.success(res.data.message);
            StyleFunctions.reset();
            navigate(location.pathname)
        }else{
            Toast.error(res.data.message);
        }
    }, [title])
    
    return (
        <Modal
            showCloseIcon = {false}
            classNames={{
                modal: "rounded-lg overflow-x-hidden w-1/2 relative"
            }}

            styles={
                {
                    modal: {
                        backgroundColor: 'black'
                    }
                }
            }
            center
            onClose={()=>{}} open={true}>
          <div className = "mt-3 w-full mb-20">
            <div className="w-full text-white" style={{
                backgroundColor: style.bg_blog_color
            }}>
                <input type="text" value={title} 
                    onChange={(e)=>{setTitle(e.target.value)}} 
                    placeholder="Title..."
                    className="w-full outline-none px-2 py-2 text-white text-4xl font-bold"
                    style={{
                        backgroundColor: style.bg_blog_color
                    }}
                    />
                <ReactEditorJS 
                    defaultValue={blog.data}
                    onInitialize={handleInitialize} 
                    holder="note"  
                    tools={TOOLS}
                    inlineToolbar={true}
                    >
                    <div id="note"/>
                </ReactEditorJS>
            </div>
            <TagEdit 
                    blog={blog} 
                    handleSaveBlog={handleSave}
                    handleCancelBlog={handleCancel}
                    is_edit={true}
                    />   
            </div>
        </Modal>
    )
}

export default NoteEditor;