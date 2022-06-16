import { BsFillPlayFill, BsMic } from "react-icons/bs";
import { GiCancel, GiSaveArrow } from "react-icons/gi";
import { AiOutlinePause } from "react-icons/ai";
import {Helper} from "../../services/Helper";
import useVoiceRecord from "./hooks/useVoiceRecorder";
import { BLOG_TYPES, Code, VOICE_RECORD_STATUS } from "../../Constants";
import Modal from "react-responsive-modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Toast } from "../../services/Toast";
import Fetch from "../../services/Fetch";
import ImageUploading, { ImageListType } from 'react-images-uploading';
import { StyleFunctions } from "../../store/style/functions";
import AudioPlay from './AudioPlay';
import { RawBlog, RawDraw, RawVoiceRecorder } from "../../store/types";
import TagEdit from "../blog/TagEdit";
import { useNavigate } from "react-router-dom";
import { StyleHook } from "../../store/style/hooks";
import { FiEdit } from "react-icons/fi";
import MusicPlay from "../music/MusicPlay";

const VoiceRecorderEdit = ({blog}:{ blog: RawBlog})=>{
    const {recorder_state, startRecording,
            saveRecording,cancelRecording,pauseRecording,continueRecording} = useVoiceRecord(blog);
    
    const navigate = useNavigate();
    const location = StyleHook.useLocation();
    const style = StyleHook.useStyle();

    const [title, setTitle] = useState((blog.data as RawVoiceRecorder).title);
    const [description, setDescription] = useState((blog.data as RawVoiceRecorder).description);
    const [background, setBackGround] = useState<ImageListType>([]);

    const handleSave = async(external: any)=>{
        let url = (blog.data as RawVoiceRecorder).url;
        if(recorder_state.blob){
            const res = await Fetch.postWithAccessToken<{code: number ,url: string,message: string}>("/api/upload/audio", {
                audio : Helper.blobToFile(recorder_state.blob,"audio")
            })

            if(res.data && res.data.code == Code.SUCCESS){
                url = res.data.url;
            }else{
                Toast.error(res.data.message);
                return;
            }
        }

        if(!url){
            Toast.error("Empty file!!");
            return;
        }
        let img_init = (blog.data as RawVoiceRecorder).background;

        if(background.length){
            const res_upload_img = await Fetch.postWithAccessToken<{code: number ,url: string,message: string}>("/api/upload/img", {
                image: background[0]? background[0].file: ""
            })

            if(res_upload_img.data){
                const {code,message,url} = res_upload_img.data;
                if(code == Code.SUCCESS){
                    img_init = url;

                }else{
                    Toast.error(message);
                }
            }
        }

        if(!img_init){
            img_init = "https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"
        }

        let data = {
            data: JSON.stringify({
                url: url,
                background: img_init,
                description: description,
                title: title
            }),
            id: blog.id,
            type: BLOG_TYPES.AUDIO
        }

        if(external){
            data = {
                ...data,
                ...external
            }
        }

        const server_url = blog.id ? "/api/me/blog.update": "/api/me/blog.create";
        const res  = await Fetch.postJsonWithAccessToken<{code: number, message: string}>(server_url,data);
    
            if(res.data.code == Code.SUCCESS){
                StyleFunctions.reset();
                navigate(location.pathname)
                Toast.success(res.data.message);
            }else{
                Toast.error(res.data.message);
            }

    }

    const handleCloseModal = ()=>{
        cancelRecording();
        navigate(location.pathname)
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
        styles={
            {
                modal: {
                    backgroundColor: 'black'
                }
            }
        }
        center
        onClose={()=>{}} open={true}>
            <div className="text-white">
                <div>
                    <input type="text" 
                            placeholder="Title..." 
                            value={title}
                            onChange={(e)=>{setTitle(e.target.value)}} 
                            className = "outline-none px-2 py-2 text-white bg-black"
                            />
                </div>
                <div className="mt-2 mb-5">
                    <input 
                        type="text" 
                        placeholder="Description..." 
                        value={description}
                        onChange={(e)=>{setDescription(e.target.value)}} 
                        className = "outline-none px-2 py-2 text-white bg-black"
                        />
                </div>
                <div className="flex flex-col items-center">
                    {
                        !recorder_state.audio && 
                        <div>{Helper.formatTime(recorder_state.recording_time)}</div>
                    }
                    {
                        recorder_state.recoding_status == VOICE_RECORD_STATUS.DURING &&
                        (
                            <div className="flex w-full justify-around">
                                <div onClick={cancelRecording} className="cursor-pointer"><GiCancel className="h-6 w-auto"/></div>
                                <div onClick={saveRecording} className="cursor-pointer"><GiSaveArrow className="h-6 w-auto"/></div>
                                <div onClick={pauseRecording} className="cursor-pointer"><AiOutlinePause className="h-6 w-auto"/></div>
                            </div>
                        )
                    }
                    
                    {
                        recorder_state.recoding_status == VOICE_RECORD_STATUS.INIT && !recorder_state.audio && 
                        (
                            <div className={`${recorder_state.recoding_status == VOICE_RECORD_STATUS.DURING ? "text-red-500":""} cursor-pointer`}>
                                <div onClick={startRecording}><BsMic className="h-12 w-auto"/></div>
                            </div>
                        )
                    }

                    <div className="flex w-full">
                        {
                            recorder_state.recoding_status == VOICE_RECORD_STATUS.PAUSE && 
                            (
                                <div className="flex w-full justify-around">
                                    <div onClick={cancelRecording} className="cursor-pointer"><GiCancel className="h-6 w-auto"/></div>
                                    <div onClick={saveRecording} className="cursor-pointer"><GiSaveArrow className="h-6 w-auto"/></div>
                                    <div onClick={continueRecording} className="cursor-pointer"><BsFillPlayFill className="h-6 w-auto"/></div>
                                </div>
                            )
                        }
                    </div>
                </div>
    
                <div className="flex w-full">
                    {
                        recorder_state.audio  && (
                            <div className="w-full flex">
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
                                        <div className="upload__image-wrapper w-24">
                                            <button
                                                className={` ${background.length > 0 && "none"} text-base outline-none focus:outline-none`}
                                                style={isDragging ? { color: 'red' } : undefined}
                                                onClick={onImageUpload}
                                                {...dragProps}
                                            >
                                                <div className='relative w-full'>
                                                    {/* <div className="bg-no-repeat bg-cover bg-center rounded"
                                                        style={{
                                                            minWidth: 80,
                                                            minHeight: 80,
                                                            backgroundImage:`url(${(blog.data as RawVoiceRecorder)?.background?(blog.data as RawVoiceRecorder).background :"https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"})`}}>
                                                    </div> */}
                                                    <img src={`${(blog.data as RawVoiceRecorder)?.background?(blog.data as RawVoiceRecorder).background :"https://i.pinimg.com/564x/20/9d/c8/209dc8034a1ca4032d499049205fa801.jpg"}`}
                                                        className="h-24 w-24"
                                                    />
                                                    <div className="absolute flex items-center top-3 right-1">
                                                        <span className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white text-black shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                                            <FiEdit/>
                                                        </span>
                                                    </div>     
                                                </div>
                                            </button>
                                            {imageList.map((image, index) => (
                                                <div key={index} className="relative">
                                                    <img src={`${image['data_url']}`}
                                                        className="h-24 w-24"/>
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
                                <div className="w-2/3 ">
                                    <AudioPlay url={recorder_state.audio} id={-1} />
                                </div>
                                <div onClick={cancelRecording} className="cursor-pointer"><GiCancel/></div>
                            </div>
                        )
                    }
                </div>
                <TagEdit blog={blog}
                    handleCancelBlog={handleCloseModal}
                    handleSaveBlog = {handleSave}
                    is_edit={true}
                />
            </div>
        </Modal>
    )
}

export default VoiceRecorderEdit;