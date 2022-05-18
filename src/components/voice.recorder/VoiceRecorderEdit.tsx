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
import { useAsync } from "react-use";
import { EmotionHook } from "../../store/emotion/hooks";
import { voiceRecoderHook } from "../../store/voice.recorder/hooks";
import { VoiceRecoderFunction } from "../../store/voice.recorder/functions";
import { StyleFunctions } from "../../store/style/functions";
import AudioPlay from './Audio';

const VoiceRecorderEdit = ()=>{
    const {recorder_state,save_status, startRecording,url_record,setSaveStatus,url_init,is_create,
            saveRecording,cancelRecording,pauseRecording,continueRecording,handleSave} = useVoiceRecord();
    
    const is_open = voiceRecoderHook.useIsOpen();
    const emotion = EmotionHook.useEmotion();
    
    useAsync(async()=>{
        console.log("URL",url_record, is_create);
        if(save_status == VOICE_RECORD_STATUS.WAIT_SAVE && url_record !="loading"){
            console.log("FETCH....",url_record);
           try {
                const url = is_create? "/api/me/blog.create": "/api/me/blog.update";
                console.log("URL",url);
                const audio = is_create ?url_record:url_record?url_record: url_init;
                const res = await Fetch.postJsonWithAccessToken<{code:number, message:string}>(url,{
                    audio: audio,
                    emotion_id: emotion.id,
                    type: BLOG_TYPES.AUDIO
                })

                if(res.data){
                    if(res.data.code == Code.SUCCESS){
                        if(res.data.message)
                        Toast.success(res.data.message);
                        cancelRecording();
                        VoiceRecoderFunction.close();
                        StyleFunctions.reset();
                    }
                    else{
                        if(res.data.message)
                        Toast.error(res.data.message)
                    }
                }
                setSaveStatus(VOICE_RECORD_STATUS.SAVE_SUCCESSFUL);
           } catch (error) {
                Toast.error("ERROR!!");
           }   
        }

    },[url_record,save_status])

    const handleCloseModal = ()=>{
        cancelRecording();
        VoiceRecoderFunction.close();
    }

    return (
        <Modal
        showCloseIcon = {false}
        classNames={{
            modal: "rounded-lg overflow-x-hidden w-2/5 relative"
        }}
        center
        onClose={()=>{}} open={is_open}>
        <>
            {is_open && (
               <div className="flex items-center justify-center flex-col">
                {save_status == VOICE_RECORD_STATUS.WAIT_SAVE && <div>Loading....</div>}
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
                            <div onClick={startRecording}><BsMic className="h-8 w-auto"/></div>
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
    
                <div className="flex w-full">
                    {
                        recorder_state.audio && (
                            <div className="w-full flex">
                                <div className="w-full">
                                    <AudioPlay url={recorder_state.audio} id={-1} />
                                </div>
                                <div onClick={cancelRecording} className="cursor-pointer"><GiCancel/></div>
                            </div>
                        )
                    }
                </div>
                <div className="flex justify-around w-full mt-5">
                    <button onClick={handleCloseModal}  className="" >
                        Cancel
                    </button>
                    <button onClick={handleSave}  className={`${!recorder_state.audio?"cursor-not-allowed opacity-25":""}`} >
                        Save
                    </button>
                </div>
            </div>
            )}
        </>
    </Modal>
    )
}

export default VoiceRecorderEdit;