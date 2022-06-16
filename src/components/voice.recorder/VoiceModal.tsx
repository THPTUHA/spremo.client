import AudioPlay from "./AudioPlay";

const VoiceModal = ({audio}:{audio: any})=>{
    return (
        <div>
            <AudioPlay url={audio.data.url} id={audio.id}/>
        </div>
    )
}

export default VoiceModal;