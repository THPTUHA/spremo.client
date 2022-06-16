import { ChangeEvent, useRef, useState } from "react";
import Modal from "react-responsive-modal";
import { useNavigate } from "react-router-dom";
import { BLOG_TYPES, Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog, RawMusic, RawUser } from "../../store/types";
import TagEdit from "../blog/TagEdit";
import {StyleHook} from '../../store/style/hooks';
import { StyleFunctions } from "../../store/style/functions";
import MusicPlay from "./MusicPlay";
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { FiEdit } from "react-icons/fi";

const readAsDataURL = (file: File) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onload = (event) => {
            if (!event.target) {
                return resolve(null);
            }

            return resolve(event.target.result);
        }
        reader.readAsDataURL(file);
    });
};


const MusicEditor = ({blog}:{blog: RawBlog})=>{
    const [name, setName] = useState((blog.data as RawMusic).name);
    const [description, setDescription] = useState((blog.data as RawMusic).description);
    const [background, setBackGround] = useState<ImageListType>([]);
    const [data_url, setDataUrl] = useState((blog.data as RawMusic).url);
    const location = StyleHook.useLocation();
    
    const style = StyleHook.useStyle();
    const url_ref  = useRef("");
    const img_ref = useRef("");

    const [files, setFiles] = useState<File[]>([]);
    const navigative = useNavigate();


    const hanleChangeFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
    
            var url = await readAsDataURL(e.target.files[0]);
            setDataUrl(url as string || "");
            // let audio_preview = audio_ref.current;
            // audio_preview?.setAttribute("src", url as string || "");
            // audio_preview?.play();
    
            setFiles([e.target.files[0]]);
        }
    };

    const hanleSave = async(external: any)=>{
        if(!files.length && !data_url){
            Toast.error("Empty file!!!");
            return;
        }
        
        url_ref.current = data_url;
        img_ref.current = (blog.data as RawMusic)?.background;

        try {
            if(files.length){
                const res = await Fetch.postWithAccessToken<{code: number ,url: string,message: string}>("/api/upload/audio", {
                    audio : files[0]
                })
    
                if(res.data){
                    const {code,message,url} = res.data;
                    if(code == Code.SUCCESS){
                        console.log("URL",url);
                        url_ref.current = url;
    
                    }else{
                        url_ref.current = "";
                        Toast.error(message);
                    }
                }
            }

            if(background.length){
                const res_upload_img = await Fetch.postWithAccessToken<{code: number ,url: string,message: string}>("/api/upload/img", {
                    image: background[0]? background[0].file: ""
                })
    
                if(res_upload_img.data){
                    const {code,message,url} = res_upload_img.data;
                    if(code == Code.SUCCESS){
                        img_ref.current = url;
    
                    }else{
                        img_ref.current = "";
                        Toast.error(message);
                    }
                }
            }

            if(url_ref.current){
                let data = {
                    data: JSON.stringify({
                        url: url_ref.current,
                        background: img_ref.current,
                        name: name,
                        description: description,
                    }),
                    type: BLOG_TYPES.MUSIC,
                    id: blog.id,
                }
        
                if(external){
                    data = {
                        ...data,
                        ...external
                    }
                }
                const url = blog.id ? "/api/me/blog.update" :   "/api/me/blog.create"

                const response = await Fetch.postWithAccessToken<{code: number ,message: string}>(url, data)
                
                if(!response.data || response.data.code != Code.SUCCESS){
                    Toast.error(response.data.message);
                    return;
                }

                StyleFunctions.reset();
                navigative(location.pathname)
            }
        } catch (error) {
            url_ref.current = "";
            Toast.error("Emotional Damage!");
        }
        
    }

    const handleCancel = ()=>{
        navigative(location.pathname)
    }

    const onBackgroundSelectChange = (
        image_list: ImageListType
    ) => {
        setBackGround(image_list as never[]);
    };

    return (
        <Modal
        showCloseIcon = {false}
        classNames={{
            modal: "rounded-lg overflow-x-hidden w-1/2 relative"
        }}
        styles={{
            modal: {
                backgroundColor: style.bg_blog_color
            }
        }}

        center
        onClose={()=>{}} open={true}>
         <div className="text-white">
            <div>
                <input type="text" 
                        placeholder="Name..." 
                        value={name}
                        onChange={(e)=>{setName(e.target.value)}} 
                        style={{backgroundColor: style.bg_blog_color}}
                        className = "outline-none px-2 py-2 text-white"
                        />
            </div>
            <div className="mt-2 mb-5">
                <input 
                    type="text" 
                    placeholder="Description..." 
                    value={description}
                    onChange={(e)=>{setDescription(e.target.value)}} 
                    style={{backgroundColor: style.bg_blog_color}}
                    className = "outline-none px-2 py-2 text-white"
                    />
            </div>
           <div className="relative w-full flex flex-col items-center">
                <ImageUploading
                    value={background}
                    onChange={onBackgroundSelectChange}
                    maxNumber={1}
                    dataURLKey="data_url"
                >
                    {({
                        imageList,
                        onImageUpload,
                        onImageUpdate,
                        isDragging,
                        dragProps,
                    }) => (
                        <div className="upload__image-wrapper w-full">
                            <button
                                className={` ${background.length > 0 && "none"} text-base outline-none focus:outline-none`}
                                style={isDragging ? { color: 'red' } : undefined}
                                onClick={onImageUpload}
                                {...dragProps}
                            >
                                <div className='relative w-full'>
                                    <div className="bg-no-repeat bg-cover bg-center rounded"
                                        style={{
                                            minWidth: 646,
                                            minHeight: 200,
                                            backgroundImage:`url(${(blog.data as RawMusic)?.background?(blog.data as RawMusic).background :"https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"})`}}>
                                    </div>
                                    <div className="absolute flex items-center top-3 right-1">
                                        <span className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white text-black shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                            <FiEdit />
                                        </span>
                                    </div>     
                                </div>
                            </button>
                            {imageList.map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-no-repeat rounded bg-center  bg-cover"
                                        style={{
                                            minWidth: 646,
                                            minHeight: 200,
                                            backgroundImage:`url(${image['data_url']})`
                                        }}>
                                    </div>
                                    <div className="absolute flex items-center top-3 right-1">
                                        <span onClick={() => onImageUpdate(index)} className=" text-black cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                            <FiEdit />
                                        </span>
                                    </div> 
                                </div>
                            ))}
                        </div>
                    )}
                </ImageUploading>
                {files.length > 0 || data_url ? (
                    <div className="absolute bottom-1 w-full" style={{backgroundColor:"transparent"}}>
                        <MusicPlay url={data_url} />
                    </div> 
                ):(
                    <button className="cursor-pointer absolute bottom-5 w-full bg-green-500 w-24 rounded">
                       <label htmlFor="inputTag">
                            <span>Upload</span>
                            <input id="inputTag" type="file" name="file" onChange={hanleChangeFile} style={{display:"none"}} />
                       </label>
                    </button>
                )}
           </div>
            <div onClick={()=>{setFiles([])}}>Delete</div>
            <TagEdit  
                blog = {blog} 
                handleSaveBlog = {hanleSave}
                handleCancelBlog = {handleCancel} 
                is_edit = {true}
            />
        </div>
    </Modal>
    )
}

export default MusicEditor;