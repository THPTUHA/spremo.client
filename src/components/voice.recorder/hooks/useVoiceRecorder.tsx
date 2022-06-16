import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { VOICE_RECORD_STATUS } from "../../../Constants";
import { RawBlog, RawVoiceRecorder } from "../../../store/types";
import { voiceRecoderHook } from "../../../store/voice.recorder/hooks";

type VoiceRecord = {
    recording_time: number,
    recoding_status: number,
    media_stream: MediaStream | null;
    media_recorder: MediaRecorder | null;
    audio: string | null,
    blob: Blob | null
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
    blob: null
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
 
function useVoiceRecord(blog: RawBlog){
    const [recorder_state , setRecorderState] = useState<VoiceRecord>({
        recording_time: 0,
        recoding_status: VOICE_RECORD_STATUS.INIT,
        media_stream: null,
        media_recorder: null,
        audio: (blog.data as RawVoiceRecorder).url || null,
        blob: null
    });

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
                      blob: blob
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

            setRecorderState((prevState) => {
              if (prevState.media_recorder){
                return {
                    ...initialState,
                    audio: window.URL.createObjectURL(blob),
                    blob: blob
                  };
              }
              else {
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
        startRecording: () => startRecording(setRecorderState),
        cancelRecording: () => {setRecorderState(initialState)},
        saveRecording: () => saveRecording(recorder_state.media_recorder),
        pauseRecording: () => pauseRecording(recorder_state.media_recorder),
        continueRecording: () => continueRecording(setRecorderState),
    }
}

export default useVoiceRecord;