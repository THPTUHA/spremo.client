import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { createReactEditorJS } from 'react-editor-js';
import { BLOG_TYPES, Code } from '../../Constants';
import { Toast } from '../../services/Toast';
import { EmotionHook } from "../../store/emotion/hooks";
import { MeHook } from "../../store/me/hooks";

import {DataEditor} from '../../DATA';
//@ts-ignore
import Embed from '@editorjs/embed'
//@ts-ignore
import Table from '@editorjs/table'
//@ts-ignore
import List from '@editorjs/list'
//@ts-ignore
import Warning from '@editorjs/warning'
//@ts-ignore
import CodeTool from '@editorjs/code'
// //@ts-ignore
// import LinkTool from '@editorjs/link'
//@ts-ignore
import Image from '@editorjs/image'
//@ts-ignore
import Raw from '@editorjs/raw'
//@ts-ignore
import Header from '@editorjs/header'
//@ts-ignore
import Quote from '@editorjs/quote'
// //@ts-ignore
// import Marker from '@editorjs/marker'
//@ts-ignore
import CheckList from '@editorjs/checklist'
//@ts-ignore
import Delimiter from '@editorjs/delimiter'
//@ts-ignore
import InlineCode from '@editorjs/inline-code'
//@ts-ignore
import SimpleImage from '@editorjs/simple-image'
import Fetch from "../../services/Fetch";
import { useNavigate } from "react-router-dom";

const ReactEditorJS = createReactEditorJS();

class Voice {
    static get toolbox() {
      return {
        title: 'Voice',
        icon: ' <img width="17" height="15" src = "/voice.svg"/>'
      };
    }
  
    render(){
      return document.createElement('input');
    }
  
    save(blockContent: any){
      return {
        url: blockContent.value
      }
    }
}

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
    embed: Embed,
    table: Table,
    list: List,
    warning: Warning,
    code: CodeTool,
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
    raw: Raw,
    header: Header,
    quote: Quote,
    checklist: CheckList,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    simpleImage: SimpleImage,
    voice: Voice
}
const TextEditor = ({blog}:{blog: any})=>{
    const editorCore = useRef<any>(null);
    const emotion = EmotionHook.useEmotion();
    const navigate = useNavigate()
    const me = MeHook.useMe();

    const handleInitialize = useCallback((instance) => {
        editorCore.current = instance;
    }, [])

    const handleSave =  useCallback(async() => {
        const saved_data = await editorCore.current.save();
        if(blog.id){
            const res  = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/me/blog.update',{
                data: JSON.stringify(saved_data),
                emotion_id: emotion.id,
                id: blog.id,
                type: BLOG_TYPES.COMBINE
            });
    
            if(res.data.code == Code.SUCCESS){
                Toast.success(res.data.message);
                navigate(`../blog/${me?.username}/`)
            }else{
                Toast.error(res.data.message);
            }

        }else{
            const res  = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/me/blog.create',{
                data: JSON.stringify(saved_data),
                emotion_id: emotion.id,
                type: BLOG_TYPES.COMBINE
            });
    
            if(res.data.code == Code.SUCCESS){
                Toast.success(res.data.message);
                navigate(`../blog/${me?.username}/`)
            }else{
                Toast.error(res.data.message);
            }
        }
    }, [])
    
    return (
    <div className = "mt-10 w-full flex justify-center mb-20">
       <div className="bg-gray-500 w-2/3 text-white">
            <ReactEditorJS 
                defaultValue={blog.data}
                onInitialize={handleInitialize} holder="custom"  tools={TOOLS}>
                <div id="custom"/>
            </ReactEditorJS>
            <button onClick={handleSave} className="bg-green-500 text-white fixed px-3 z-40 top-20 py-1 rounded font-medium left-8">
                Save
            </button>
       </div>
    </div>)
}

export default TextEditor;