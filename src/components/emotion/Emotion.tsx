import { MdInsertEmoticon } from "react-icons/md"
import { EMOTION_IDS } from "../../Constants"


const Angry = ()=>{
    return (
        <li className="angry active">
            <div>
                <svg className="eye left">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="eye right">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="mouthsm">
                    <use xlinkHref="#mouthsm"/>
                </svg>
            </div>
        </li>
    )
}

const Sad = ()=>{
    return (
        <li className="sad active">
            <div>
                <svg className="eye left">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="eye right">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="mouthsm">
                    <use xlinkHref="#mouthsm"/>
                </svg>
            </div>
        </li>
    )
}

const Ok = ()=>{
    return (
        <li className="ok active">
            <div></div>
        </li>
    )
}

const Good = ()=>{
    return (
        <li className="good active" >
            <div>
                <svg className="eye left">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="eye right">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="mouthsm">
                    <use xlinkHref="#mouthsm"/>
                </svg>
            </div>
        </li>
    )
}

const Happy = ()=>{
    return (
        <li className="happy active">
            <div>
                <svg className="eye left">
                    <use xlinkHref="#eye"/>
                </svg>
                <svg className="eye right">
                    <use xlinkHref="#eye"/>
                </svg>
            </div>
        </li>
    )
}

const getEmotion = (id: number)=>{
    switch(id){
        case EMOTION_IDS.HAPPY:
            return <Happy/>
        case EMOTION_IDS.ANGRY:
            return <Angry/>
        case EMOTION_IDS.GOOD:
            return <Good/>
        case EMOTION_IDS.OK:
            return <Ok/>
        case EMOTION_IDS.SAD:
            return <Sad/>
    }
    return <MdInsertEmoticon  className="w-8 h-auto"/>
}
const Emotion = ({id}: {id: number})=>{
    return (
        <>
            <ul className="feedback cursor-pointer">
                {getEmotion(id)}
            </ul>
        </>
    )
}

export default Emotion;