import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { EmtionFunctions } from "../../store/emotion/functions";
import { EmotionHook } from "../../store/emotion/hooks";
import { MeHook } from "../../store/me/hooks";
import {BiAngry, BiHappyBeaming, BiSad} from 'react-icons/bi';
import { EMOTIONS, EMOTION_IDS, ROLES } from "../../Constants";
import Emotion from "./Emotion";

const EmotionList = ()=>{
    const me = MeHook.useMe();
    const emotion = EmotionHook.useEmotion();
    const [status, setStatus] = useState(0);
    
    useEffect(()=>{
        document.querySelectorAll('.feedback li').forEach(entry => entry.addEventListener('click', e => {
            if(!entry.classList.contains('active')) {
                const active = document.querySelector('.feedback li.active')
                if(active){
                    active.classList.remove('active');
                }
                entry.classList.add('active');
            }
            e.preventDefault();
        }));
    },[])
    return (
       <>
        {
            me?.role != ROLES.DEVELOPER && (
                <Modal
                    showCloseIcon = {false}
                    center
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                    }}
                    onClose={()=>{}} open={emotion.is_change}>
                    <>
                        {emotion.is_change && (
                            <div className="flex justify-around">
                                {
                                    EMOTIONS.map(emotion => <div key={emotion.id} onClick={()=>{EmtionFunctions.set(emotion.id)}}>
                                        <Emotion id={emotion.id} />
                                    </div>)
                                }
                            </div>
                        )}
                    </>
                </Modal>
            )
        }
       </>
    )
}

export default EmotionList;