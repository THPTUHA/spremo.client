import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { VOICE_RECORD_STATUS } from "../../../Constants";
import Fetch from "../../../services/Fetch";
import { Helper } from "../../../services/Helper";
import { Code } from '../../../Constants';
import { Toast } from "../../../services/Toast";
import { useAsync } from "react-use";
import { voiceRecoderHook } from "../../../store/voice.recorder/hooks";

type VoiceRecord = {
    recording_time: number,
    recoding_status: number,
    media_stream: MediaStream | null;
    media_recorder: MediaRecorder | null;
    audio: string | null,
};

type Interval = null | number | ReturnType<typeof setInterval>;

type MediaRecorderEvent = {
    data: Blob;
};

const initialState: VoiceRecord = {
    recording_time: 0,
    recoding_status: VOICE_RECORD_STATUS.INIT,
    media_stream: null,
    media_recorder: null,
    audio: null,
};


const MAX_RECORDER_TIME = 20;
let is_temporary_save = false;

async function startRecording (setRecorderState: Dispatch<SetStateAction<VoiceRecord>>){
    try {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setRecorderState((prevState) => {
        return {
            ...prevState,
            recoding_status: VOICE_RECORD_STATUS.DURING,
            media_stream: stream,
        };
        });
    } catch (error) {
        console.log(error);
    }
}

function pauseRecording(recorder: any) {
    if (recorder.state !== "inactive") recorder.pause();
}

function continueRecording(setRecorderState: Dispatch<SetStateAction<VoiceRecord>>) {

    setRecorderState((prevState) => {
        if(prevState.media_recorder){
            prevState.media_recorder.resume();
        }
        return {
                ...prevState,
                recoding_status: VOICE_RECORD_STATUS.DURING,
            };
        });
}

function saveRecording(recorder: any) {
    is_temporary_save = true;
    if (recorder.state !== "inactive") recorder.stop();
}
 
function useVoiceRecord(){
    const voice = voiceRecoderHook.useAll();
    const [recorder_state , setRecorderState] = useState<VoiceRecord>(initialState);

    const [save_status, setSaveStatus] = useState(0);
    const [url_record,setUrlRecord ] = useState("");

    useEffect(()=>{
        setRecorderState({...initialState, audio: voice.url});
    },[voice])


    const handleSave = ()=>{
        if(!recorder_state.audio) return;
        console.log("CLICK");
        setSaveStatus(VOICE_RECORD_STATUS.WAIT_SAVE);
    }

    useEffect(()=>{
        let recording_interval: Interval = null;
        if(recorder_state.recoding_status === VOICE_RECORD_STATUS.DURING){
            recording_interval = setInterval(()=>{
               setRecorderState((prevState)=>{
                if(recorder_state.recording_time > MAX_RECORDER_TIME){
                    typeof recording_interval === "number" && clearInterval(recording_interval);
                    return prevState;
                }
                return {
                    ...prevState,
                    recording_time: prevState.recording_time + 1
                }
               })
            },1000);
        }
        else typeof recording_interval === "number" && clearInterval(recording_interval);

        return () => {
          typeof recording_interval === "number" && clearInterval(recording_interval);
        };
    },[recorder_state.recoding_status])

    useEffect(() => {
        setRecorderState((prevState) => {
            console.log("media record")
            if (prevState.media_stream)
                return {
                ...prevState,
                media_recorder: new MediaRecorder(prevState.media_stream),
                };
            else return prevState;
        });
    }, [recorder_state.media_stream]);

    useEffect(() => {
        const recorder = recorder_state.media_recorder;
        console.log("RECORDER",recorder);
        let chunks: Blob[] = [];
    
        if (recorder && recorder.state === "inactive") {
          recorder.start();
    
          recorder.ondataavailable = (e: MediaRecorderEvent) => {
            chunks.push(e.data);
          };
          
          recorder.onpause = ()=>{
            const blob = new Blob(chunks, { type:"audio/mp3" });
            setRecorderState((prevState) => {
                if (prevState.media_recorder){
                  return {
                      ...prevState,
                      recoding_status: VOICE_RECORD_STATUS.PAUSE,
                    };
                }
                else {
                  console.log("CANCEL...");
                  return initialState;
                }
              });
          }

          recorder.onstop = async() => {
            const blob = new Blob(chunks, { type:"audio/mp3" });
            chunks = [];
            const audio  =  window.URL.createObjectURL(blob);
            console.log("AUDIO---",audio);
            // const reader = new FileReader();
            // reader.readAsDataURL( Helper.blobToFile(blob,"audio"));
            // console.log("PRE DATA",reader.result);
            // const reader = new FileReader();
            // reader.readAsDataURL(blob);
            // reader.onloadend = async() => {
            //     const res = await Fetch.postWithAccessToken<{code: number }>("/api/voice.record/create", {
            //         audio : reader.result
            //      })
                
            //      console.log("DATA AUDIO",res.data);
            // };
            new Promise(()=>{
                console.log("RECORDER_STATE", is_temporary_save);
                if(is_temporary_save){
                    setUrlRecord("loading");
                    Fetch.postWithAccessToken<{code: number ,url: string,message: string}>("/api/upload/audio", {
                        audio : Helper.blobToFile(blob,"audio")
                    }).then((res)=>{
                        //@ts-ignore
                        const {code, url,message} = res.data
                        if(code == Code.SUCCESS){
                            setUrlRecord(url);
                        }else{
                            Toast.error(message)
                        }
                        is_temporary_save = false;
                    }).catch((error)=>{
                        console.log(error);
                        Toast.error("ERROR!!");
                        is_temporary_save = false;
                    })
                }
            })

            setRecorderState((prevState) => {
              if (prevState.media_recorder){
                return {
                    ...initialState,
                    audio: window.URL.createObjectURL(blob)
                  };
              }
              else {
                console.log("CANCEL...");
                return initialState;
              }
            });
          };
        }
    
        return () => {
          if (recorder) recorder.stream.getAudioTracks().forEach((track: MediaStreamTrack) => track.stop());
        };
    }, [recorder_state.media_recorder]);

    return {
        recorder_state,
        save_status,
        url_init: voice.url,
        is_create: voice.is_create,
        url_record,
        setSaveStatus,
        startRecording: () => startRecording(setRecorderState),
        cancelRecording: () => {setRecorderState(initialState); setUrlRecord("")},
        saveRecording: () => saveRecording(recorder_state.media_recorder),
        pauseRecording: () => pauseRecording(recorder_state.media_recorder),
        continueRecording: () => continueRecording(setRecorderState),
        handleSave: ()=> handleSave()
    }
}

export default useVoiceRecord;