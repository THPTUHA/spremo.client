import Loading from "../../../../components/loading";
import Constants, { Code, PodcastSource } from "../../../../Constants";
import {  useEffect, useState } from "react";
import Fetch from "../../../../services/Fetch";
import { Helper } from "../../../../services/Helper";
import { RawPodcast, RawPodcastSubmit } from "../../../../store/types";
import Link from 'next/link';

//@ts-ignore
import ReactHtmlParser from 'react-html-parser'
import { AiOutlineLoading3Quarters, } from "react-icons/ai";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { Toast } from "../../../../services/Toast";

import { getHintText } from "../../../../utils/hint/hint";
import { MeHook } from "../../../../store/me/hooks";
import Meta from "../../../../components/ui/Meta";
import { FacebookShareButton } from "react-share";
import { FiShare2 } from "react-icons/fi";
import LogEvent from "../../../../packages/firebase/LogEvent";
import HomeFooter from "../../../../components/footer/HomeFooter";
import { useParams, useNavigate } from "react-router-dom";
import { ChallengeHook } from "../../../../store/challenge/hooks";

type RecordPodcast = {
    is_listening: boolean,
    is_submitted:boolean,
    challenge_name?:string,
    start_time?:number,
    challenge_id?:number,
}

const Detail = () => {
    const {name,id} = useParams();
    const [podcast, setPodcast] = useState<RawPodcast>();
    const [is_listening,setIsListening] = useState<boolean>(false);
    const [is_submitted,setIsSubmitted] = useState<boolean>(false);
    const [on_loading_listen, setOnLoadingListen] = useState(false);
    const [on_loading_listen_hint, setOnLoadingListenHint] = useState(false);
    const [record_podcasts,setRecordPodcasts] =useState<RecordPodcast[]>([]);
    const me = MeHook.useMe();
    const challenges = ChallengeHook.useFetchChallengeByPodcastID(podcast?podcast.id:-1);
    // console.log(challenges);
    useEffect(()=>{
        if(me){
            (async()=>{
                try {
                    const res = await Fetch.postWithAccessToken<{ podcast: RawPodcast, is_listening: boolean, is_submitted: boolean, code: number ,record_podcasts:RecordPodcast[]}>('/api/podcasts/detail', {
                        id: id,
                    });
                    const {podcast , is_listening, is_submitted, record_podcasts} = res.data;
                    console.log(res.data);
                    setPodcast(podcast);
                    setIsListening(is_listening);
                    setIsSubmitted(is_submitted);
                    setRecordPodcasts(record_podcasts);
                    // console.log(podcast.result,podcast.hint,getHintText(podcast.result, podcast.hint))
                } catch (error) {
                    Toast.error("Error ...");
                }
    
            })();
        }
    },[me]);
    const navigate = useNavigate();
    const clickListen = async (type?: string) => {
        if (type == "normal") {
            setOnLoadingListen(true);
        }
        else if (type == "hint") {
            setOnLoadingListenHint(true)
        }

        if (!me) {
            Toast.error("You have to log in first!")
            navigate("/authentication/login")
            return;
        }

        let result = false;

        if (is_listening) {
            result = true;
        }

        if (!result) {
            if (type == "normal") {
                LogEvent.sendEvent("listen.normal");
                result = await (await import("react-st-modal")).Confirm('Do you want to start listening this podcast?', 'CONFIRMING!');
            }
            else if (type == "hint") {
                LogEvent.sendEvent("listen.with_hint");
                result = await (await import("react-st-modal")).Confirm('Do you want to finish the listen of this podcast with hint \n it will help you listen easier but decrease your final points?', 'CONFIRMING!');
            }
        }

        if (!result) {
            if (type == "normal") {
                setOnLoadingListen(false);
            }
            else if (type == "hint") {
                setOnLoadingListenHint(false)
            }
            return;
        }

        LogEvent.sendEvent("listen.continue");
        try {
            if (podcast) {
                const res = await Fetch.postWithAccessToken<{ podcast_submit: RawPodcastSubmit, code: number }>('/api/podcast.submit/get', {
                    id: podcast.id,
                    metatype: type ? type : '',
                    hint: type == "hint" ? getHintText(podcast.result, podcast.hint) : ""
                });

                if (res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        if (!is_submitted) {
                            Toast.success("Start Listening!");
                            navigate(`/podcasts/listen/${Helper.generateCode(podcast.name)}/${podcast.id}`);
                        } else {
                            navigate(`/podcasts/listen/${Helper.generateCode(podcast.name)}/${podcast.id}/result`);
                        }

                    }
                }
            }
        }
        catch {
            Toast.error("Some errors occurred!")
        }

        if (type == "normal") {
            setOnLoadingListen(false);
        }
        else if (type == "hint") {
            setOnLoadingListenHint(false)
        }
    };

    const renderButton = () => {
        if (!me) {
            return (<Link href='/authentication/login'>
                <a className="bg-primary text-white py-2 font-medium rounded shadow hover:bg-primary-dark transition-all cursor-pointer w-48 flex items-center justify-center ">
                    <span>Đăng nhập để nghe</span>
                </a>
            </Link>);
        }

        if (!is_listening) {
            return (<>
                <a
                    onClick={() => { clickListen("hint") }}
                    className=" mr-3 bg-primary text-white py-2 font-medium rounded shadow mb-3 hover:bg-primary-dark transition-all cursor-pointer w-44 flex items-center justify-center ">
                    {on_loading_listen_hint && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                    <span>Listen With Hint</span></a>
                <a
                    onClick={() => { clickListen("normal") }}
                    className=" bg-primary text-white py-2 font-medium rounded shadow mb-3 hover:bg-primary-dark transition-all cursor-pointer w-48 flex items-center justify-center ">
                    {on_loading_listen && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                    <span>Listen Without Hint</span></a>
            </>);
        }

        return (<a
            onClick={() => { clickListen() }}
            className=" bg-primary text-white py-2 font-medium rounded shadow hover:bg-primary-dark transition-all cursor-pointer w-48 flex items-center justify-center ">
            {on_loading_listen && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
            <span>{is_submitted ? "See your listen result" : "Continue Listening"}</span>
        </a>);
    };

    return (<>
     {podcast? 
     <>
     <Meta url={`${Constants.DOMAIN}/podcasts/detail/${Helper.generateCode(podcast.name + "_" + podcast.sub_name)}/${podcast.id}`}
            description={Helper.extractContent(podcast.description).slice(0, 200)}
            title={`ESL ${podcast.sub_name} ${podcast.name}`}
            image={`${Constants.IMAGE_URL + podcast.image_url}`}
        />
        <div className="container mx-auto mt-16">
            <div className="w-full px-10">
                <ul className="flex items-center uppercase font-medium text-gray-400  text-sm mb-5">
                    <li>
                        <Link href="/" >
                            <a className="hover:text-gray-800 transition-all">
                                Home
                            </a>
                        </Link>
                    </li>
                    <li><span className="mx-1">/</span></li>
                    <li>
                        <Link href="/podcasts" >
                            <a className="hover:text-gray-800 transition-all">
                                Podcast
                            </a>
                        </Link>
                    </li>
                    <li><span className="mx-1">/</span></li>
                    <li>
                        <p>{podcast.name}</p>
                    </li>
                </ul>
                {/* {router.isFallback && <Loading />} */}
                {podcast && (<>
                    <div className="mb-3">
                        <div className="flex justify-start items-center">
                            <h1 className="text-xl font-semibold text-primary">ESL {podcast.sub_name}</h1>
                            <FacebookShareButton
                                url={`${Constants.DOMAIN}/podcasts/detail/${Helper.generateCode(podcast.name + "_" + podcast.sub_name)}/${podcast.id}`}
                                className="outline-none focus:outline-none ml-5"
                            ><>
                                    <span className="text-xl text-gray-700">
                                        <FiShare2 />
                                    </span>
                                </></FacebookShareButton>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">{podcast.name}</h3>
                    </div>

                    <div className="flex flex-wrap justify-center">
                        <div className="sm:w-1/3 w-full">
                            <div className="">
                                <img className="max-h-38" src={`${Constants.IMAGE_URL + podcast.image_url}`} alt="" />
                            </div>
                            <div className="mt-3">
                                <h5 className="text-base font-bold text-gray-800">Source</h5>
                                <a className="underline hover:text-primary transition-all" href={`${PodcastSource[podcast.source_key].source_link}`} target="_blank">{PodcastSource[podcast.source_key].source_name}</a>
                            </div>
                            {podcast.download_link.length > 0 ? (<>
                                <div className="mt-3">
                                    <h5 className="text-base font-bold text-gray-800">Downloads</h5>
                                    <ul>
                                        {podcast.download_link.map((link, index) => (
                                            <li key={index}>
                                                <a className="underline hover:text-primary transition-all" href={`${link.link}`} target="_blank">{link.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>) : (<></>)}

                            <div className="flex flex-col mt-10">
                                <div className="flex flex-col">
                                    {
                                        challenges &&  challenges.map((e)=>{
                                             return (<div className="flex text-green-600 items-center" key={e.id}>
                                                <HiOutlineBadgeCheck/>  
                                                <span className="ml-1 mb-1">{e.name}</span>
                                            </div>)
                                         })
                                     }
                                </div>
                                <div className="flex">
                                    {renderButton()}
                                </div>
                            </div>

                        </div>
                        <div className="sm:w-2/3 sm:pl-5 w-full sm:mt-0 mt-5 mb-10">
                            {ReactHtmlParser(podcast.description)}
                        </div>
                    </div>
                    <div></div>

                </>)}
            </div>
        </div>
        <div className="mt-20">
            <div
                style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,.1), rgba(255,255,255,.1)), url('/static/footer.jpg')` }}
                className="flex bg-center bg-cover">
                <div className="custom-container">
                    <HomeFooter />
                </div>
            </div>
        </div>

    </>
    :""}
    </>)
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJson<{ podcast: RawPodcast, is_listening: boolean, is_submitted: boolean, code: number }>('/api/podcasts/detail', {
//         id: context.params ? (context.params)['id'] : 0,
//         access_token: Helper.getCookieFromReq("access_token", context.req.headers.cookie ? context.req.headers.cookie.toString() : "")
//     })
//     return {

//         props: {
//             podcast: res.data.podcast,
//             is_listening: res.data.is_listening,
//             is_submitted: res.data.is_submitted
//         },
//     }
// }



export default Detail;