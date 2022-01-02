import { useEffect, useMemo, useState } from "react"
import { RawPodcast, RawPodcastSubmit, RawUser ,RawPodcastChallenge} from "../../store/types"
import React from "react";
import ResultModal from './ResultModal'
import Voice from '../../services/Voice';
import { FaMedal } from "react-icons/fa";
import Avatar from "../../components/ui/Avatar";
import { GiSpeaker } from "react-icons/gi";

import { UserHook } from "../../store/user/hooks";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { CSSTransition } from "react-transition-group";
import Player from './Player';
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import Fetch from "../../services/Fetch";
import { Code } from '../../Constants';
import { Toast } from "../../services/Toast";
import { useAsync } from "react-use";
import { MeHook } from "../../store/me/hooks";
import { HiOutlineBadgeCheck } from "react-icons/hi";

interface Props {
    podcast: RawPodcast,
    podcast_submit: RawPodcastSubmit,
    metatype?:{
        id:number,
        challenge_id: number,
        challenge_name: string
    }
}

interface ResponseType {
    user_record: RawPodcastChallenge,
    records: RawPodcastChallenge[],
    page_size: number,
    rank: number,
    code: number,
    message:string 
}

const getUserId = (members:{score:number,user_id:number}[],records?: RawPodcastChallenge[])=>{
    if(records && records.length)
        return records.map(e=>e.user_id);
    return members.map(e=>e.user_id);
}
const Result = ({ podcast, podcast_submit,metatype}: Props) => {

    const [enable_listen, setEnableListen] = useState(false);
    const [selected_correct_word, setCorrectWord] = useState(-1);
    const [openModal, setOpenModal] = useState(false);
    const [page,setPage] = useState(1);

    useEffect(() => {
        Voice.init();
    }, [])
    const me = MeHook.useMe();
    const state = useAsync(async()=>{
       if(metatype){
            console.log("Fecth list");
            const res = await Fetch.postWithAccessToken<ResponseType>('/api/record.challenge.user/podcast.result.user_list', {
                id: podcast.id,
                challenge_id: metatype.challenge_id,
                record_challenge_user_id: metatype.id,
                page:page
            });
            if(res.status == 200){
                if(res.data && res.data.code == Code.SUCCESS){
                    return {
                        records: res.data.records,
                        user_record: res.data.user_record,
                        rank: res.data.rank,
                        page_size: res.data.page_size
                    }
                }
            }
            return {
                records: [],
                user_record: {} as RawPodcastChallenge,
                rank:0,
                page_size:0
            } 
       }
    },[page,me]);

    UserHook.useFetchUsers(getUserId(podcast.members,state.value?.records));

    const sumarize_words = useMemo(()=> {
        var wrong_words: {[key: string]: {
            references: string[],
            freq: number
        }} = {};
            var keys = Object.keys(podcast_submit.compare_result.wrong_phrases);
            keys.forEach(key => {
                if (!wrong_words[key]) {
                    wrong_words[key] = {
                        references: [],
                        freq: 0
                    }
                }
                wrong_words[key].references = [...wrong_words[key].references, ...podcast_submit.compare_result.wrong_phrases[key]];
                wrong_words[key].freq += podcast_submit.compare_result.wrong_phrases[key].length

            })
        

        return Object.keys(wrong_words).map(key => ({
            label: key,
            freq: wrong_words[key].freq,
            references: wrong_words[key].references
        }));
    }, [podcast_submit])
    console.log(state.value?.user_record);
    return (<>
        {podcast && (<>
            <div className="w-full pb-32 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10 mb-20">
                <div className="flex items-center">
                    <h1 className=" text-primary text-2xl font-semibold">
                        {podcast.name ? podcast.name : ""}
                    </h1>
                    <h2 className=" text-xl text-gray-900 ml-4 font-bold">
                        {podcast.sub_name ? podcast.sub_name : ""}
                    </h2>
                    {metatype && <>
                        <HiOutlineBadgeCheck className="ml-3 text-green-500"/>
                        <h2 className=" text-xl text-green-500 font-bold">
                            {metatype.challenge_name}
                        </h2>
                    </>}
                    <a
                        onClick={() => setEnableListen(!enable_listen)}
                        className=" ml-4  bg-primary text-white py-1 px-3 rounded-2xl font-medium rounded shadow hover:bg-primary-dark transition-all cursor-pointer flex items-center justify-center ">
                        <span>{enable_listen ? "Hide listen": "Listen"}</span>
                    </a>

                </div>
                <p className="mt-2 text-gray-400">Get summary of your result here</p>
                <div className="w-full flex flex-wrap mt-5">
                    <div className=" w-full semi-md:w-5/12 px-0 md:px-5">
                        <div className="px-10 py-10 rounded-3xl shadow-lg">
                            <h3 className=" font-semibold text-2xl">Overall</h3>
                            <h5 className=" text-yellow-300 text-8xl font-medium">{Math.floor((podcast_submit.compare_result.percent as number) * 100)}%</h5>

                            <div className="relative pt-1">
                                <div className="overflow-hidden h-3 mt-2 mb-4 text-xs flex rounded bg-gray-200">
                                    <div style={{ width: `${Math.floor((podcast_submit.compare_result.percent as number) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                </div>
                            </div>
                        </div>

                        <div className="px-10 pt-10 pb-5 rounded-3xl shadow-lg">
                            <h3 className=" font-semibold text-2xl">Top Results</h3>
                            <div className="w-full ">
                                {
                                    state.value?<BillboardItem key={state.value.user_record.id} index={state.value.rank} user_id={state.value.user_record.user_id} score={state.value.user_record.data[podcast.id].point} is_user={true} />:""
                                }
                                {
                                   state.value?state.value.records.map((e,index)=><BillboardItem key={e.id} index={index} user_id={e.user_id} score={e.point} />)
                                        :podcast.members.sort((a, b) => b.score - a.score).map((member, index) => <BillboardItem key={index} index={index} user_id={member.user_id} score={member.score} />)
                                }
                            </div>
                            <div className="flex ml-2  justify-center ">
                               {metatype && <>
                                    <BsArrowLeftCircle onClick={()=>(page-1)<=0?page:setPage(page-1)} className="w-6 h-6 cursor-pointer"/>
                                    <div className="flex ml-2 mb-1 text-xl ">{page}</div>
                                    <BsArrowRightCircle onClick={()=>page*6>= (state.value?state.value.page_size:0)?page:setPage(page+1)} className="w-6 h-6 ml-2 cursor-pointer"/>
                               </>}
                            </div>
                        </div>
                    </div>
                    <div className=" w-full semi-md:w-7/12 px-0 md:px-5">
                        <div className="px-10 pt-10 pb-5 rounded-3xl shadow-lg">
                            <h3 className=" font-semibold text-2xl">Words you got wrong</h3>
                            <div className="w-full flex flex-wrap">
                                <div className="w-full py-2 pr-4 flex items-center">
                                    <div className=" w-4/5">
                                        <span className=" text-gray-300 font-medium">Correct Words</span>
                                    </div>
                                    <div className=" w-1/5 flex justify-start"><span className=" text-gray-300 font-medium">Frequency</span></div>
                                </div>
                            </div>
                            <div className="w-full flex flex-wrap">
                                {sumarize_words.slice(0, 5).map((e, index) => (
                                    <div className="w-full" key={index}>
                                        <div className="w-full py-2 pr-4 flex items-center border-b border-gray-900 border-opacity-10 " >
                                            <div className="w-4/5 line-clamp-3">
                                                <span className="text-gray-400">{(index + 1).toString().padStart(2, '0')}.</span>
                                                <span className="text-sm " title={e.label}> {e.label} </span>
                                                <span><GiSpeaker onClick={() => Voice.speak(e.label)} style={{ display: 'inline-block', cursor: 'pointer' }} /></span>
                                            </div>
                                            <div className=" w-1/5 flex justify-start cursor-pointer items-center" onClick={() => setCorrectWord(index == selected_correct_word ? -1 : index)}>
                                                <span className="w-8 inline-block text-center bg-gray-200 rounded-lg text-gray-500 font-semibold">{e.freq}</span>
                                                <span className="ml-2 cursor-pointer">{selected_correct_word == index ? <FiChevronDown /> : <FiChevronUp />}</span>
                                            </div>
                                        </div>

                                        <CSSTransition
                                            unmountOnExit={true}
                                            timeout={300}
                                            in={index == selected_correct_word}
                                            classNames="css-dropdown">
                                            <div className="w-full pl-10 pb-5">
                                                {e.references.map((wrong_text, idx) => (<div key={idx}>
                                                    <span className="text-gray-400">{(idx + 1).toString().padStart(2, '0')}.</span>
                                                    <span className="text-sm " title={wrong_text}> {wrong_text} </span>
                                                    <span><GiSpeaker onClick={() => Voice.speak(wrong_text)} style={{ display: 'inline-block', cursor: 'pointer' }} /></span>
                                                </div>))}
                                            </div>
                                        </CSSTransition>
                                    </div>
                                ))}
                            </div>
                            <div className=" flex justify-center mt-5">
                                <button
                                    onClick={() => setOpenModal(true)}
                                    className=" outline-none focus:outline-none px-3 py-1 border-2 border-blue-400 rounded text-blue-400 font-medium hover:border-blue-700 hover:text-blue-700 transition-all">
                                    See all</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-14 flex flex-wrap">

                    <div className="w-1/2 px-5 none semi-md:block">

                        <div className="pb-5 pt-7 relative px-5 rounded-3xl border border-black border-opacity-20 shadow-lg">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="px-7 py-2 bg-green-100">
                                    <h3 className="uppercase font-medium">Correct Answer</h3>
                                </div>
                            </div>

                            <p>{podcast_submit.podcast_result}</p>
                        </div>
                    </div>
                    <div className=" w-full semi-md:w-1/2 px-0 md:px-5">

                        <div className="pb-5 pt-7 relative px-5 rounded-3xl border border-black border-opacity-20 shadow-lg">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                                <div className="px-7 py-2 bg-red-100">
                                    <h3 className="uppercase font-medium">Your Answer</h3>
                                </div>
                            </div>

                            <p>{podcast_submit.compare_result.diffs.map((e, index) => {
                                const type = e[0];
                                const data = e[1];

                                if (type == -1) {
                                    return (<React.Fragment key={index}>
                                        <del className="bg-red-200">{data}</del>
                                    </React.Fragment>)
                                }

                                if (type == 1) {
                                    return <span key={index} className="bg-green-200">{data}</span>
                                }

                                return (<React.Fragment key={index}>
                                    {data}
                                </React.Fragment>)
                            })}</p>
                        </div>
                    </div>
                </div>
            
                { enable_listen &&  <Player podcast={podcast}/>}
            </div>

            <ResultModal sum_up_words={sumarize_words} open={openModal} close={() => setOpenModal(false)} />
        </>)}

    </>)
}

export default Result

interface BillboardItemProps {
    user_id: number,
    index: number,
    score: number,
    is_user?: boolean
}

const BillboardItem = (props: BillboardItemProps) => {

    const user = UserHook.useUser(props.user_id);

    return (
        <>
            {user && <div className={`w-full px-2 py-4 hover:bg-gray-100 rounded-md ${props.is_user?"bg-green-100":""}`}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                        <div className="text-gray-600 mr-3">
                            {(props.index + 1).toString().padStart(2, '0')}
                        </div>
                        <Avatar user={user} />
                        <div className="flex flex-col ml-3">
                            <div className='text-sm'>{user.fullname}</div>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="flex flex-row items-center text-primary">
                            {props.score.toFixed(2)}&nbsp;<FaMedal color='#D7B354' />
                        </div>
                    </div>
                </div>
            </div>}
        </>
    )
};