import { useState } from "react";
import { AiOutlineHeart } from "react-icons/ai";
import Modal from "react-responsive-modal";
import { Code, EMOTIONS } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog } from "../../store/types";
import Emotion from "../emotion/Emotion";


const getEmotion = (emotion_id: number)=>{
    for(let i = 0;i<EMOTIONS.length;++i){
        if(EMOTIONS[i].id == emotion_id) return <Emotion id={emotion_id}/>
    }
    return <AiOutlineHeart className="w-6 h-auto cursor-pointer"/>
}

const DropEmotionBlog = ({blog}: { blog: RawBlog})=>{
    const [open_emotion,setOpenEmotion] = useState(false);
    const [emotion_id, setEmotionId] = useState(blog.emotion_id);

    const handleEmotion =async (emotion_id: number) => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,blog: any}>("/api/blog/like",{
                id: blog.id,
                emotion_id: emotion_id
            });

            if(res.data){
                const {code,message, blog} = res.data;
                if(code == Code.SUCCESS){
                    setEmotionId(emotion_id);
                    setOpenEmotion(false);
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    return (
        <>
            <div onClick={()=>{!emotion_id ? setOpenEmotion(true) : handleEmotion(0)}}>
                {getEmotion(emotion_id)}
            </div>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                }}
                center
                onClose={()=>{setOpenEmotion(false)}} open={open_emotion}>
                <>
                {
                    open_emotion && <div className="flex justify-around w-full">
                        {
                            EMOTIONS.map(emotion => <div key={emotion.id} onClick={()=>{handleEmotion(emotion.id)}}>
                                <Emotion id={emotion.id} />
                            </div>)
                        }
                    </div>
                }
                </>
            </Modal>
        </>
    )
}

export default DropEmotionBlog;