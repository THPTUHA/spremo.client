import OutsideClickDetect from "../../../components/ui/OutsideClickDetection";
import { Link, useLocation } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdTrash ,IoMdPause} from "react-icons/io";
import { VscRunAll} from "react-icons/vsc";
import Constants, { Code, LAYOUT_TYPES, MediaQuery } from "../../../Constants";
import { useEffect, useMemo, useState } from "react";
import { FaCheck, FaRegImage } from "react-icons/fa";
import { FiEdit, FiFilter } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { useAsync } from "react-use";
import Fetch from "../../../services/Fetch";
import { Helper } from "../../../services/Helper";
import { Toast } from "../../../services/Toast";
import { RawChallenge, RawPodcast } from "../../../store/types";
import Meta from "../../../components/ui/Meta";
import Paginate from '../../../components/paginate/Paginate';
import Modal from 'react-responsive-modal';
import * as uuid from 'uuid';

//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
import { round } from "lodash";
import { UserHook } from "../../../store/user/hooks";
import { PodcastHook } from "../../../store/podcast/hooks";
import { PodcastFunctions } from "../../../store/podcast/functions";
import { useRef } from "react";
import ListFilter from "../../../page.components/filter/_ListFilter";
import { useMediaQuery } from "react-responsive";
import { BsClockHistory } from "react-icons/bs";

type ResponseType = {
    challenges: RawChallenge[],
    challenge_num: number,
    code: number
}

const getPodcastIdFromChallenges = (challenges:RawChallenge[])=>{
    const ids:number[] = [];
    for(let challenge of challenges){
        if(challenge.challenge_type.limit_podcast){
            for(let temp of challenge.challenge_type.limit_podcast.podcasts)
                ids.push(temp.id);
        }
    }
    return ids;
}
const SmallMenu = ({ challenge, reload }: { challenge: RawChallenge, reload: () => void }) => {
    const [open, setOpen] = useState(false);
    const onClickDelete = async () => {
        let result = await window.confirm("Are you sure to delete challenge " + challenge.name + "?");
        if (result) {
            try {
                const res: any = await Fetch.postWithAccessToken<{ challenge: RawChallenge, code: number }>("/api/challenges/remove", {
                    id: challenge.id
                })

                if (res && res.data) {
                    if (res.data.code != Code.SUCCESS) {
                        Toast.error(res.data.message)
                        return;
                    }
                    else {
                        Toast.success("Remove challenge Successful!")
                        reload();
                        return;
                    }
                }
            }
            catch {
            }
            Toast.error("Some errors occurred!")
        }
    }

    const onChangeStatus = async (status:number) => {
        try {
            const res: any = await Fetch.postWithAccessToken<{ challenge: RawChallenge, code: number }>("/api/challenges/change.status", {
                id: challenge.id,
                status:status
            })

            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                else {
                    if(status==Constants.CHALLENGE.ACTIVE)
                        Toast.success("Active challenge successful!");
                    else Toast.success("Unactive challenge successful!");
                    reload();
                    return;
                }
            }
        }
        catch {
        }
        Toast.error("Some errors occurred!")
    }
    return (<>
        <OutsideClickDetect outsideFunc={() => setOpen(false)}>
            <div className="flex relative flex-col justify-end items-end">

                <span
                    onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                    className=" cursor-pointer px-1.5 py-1.5 mb-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                    <HiDotsVertical />
                </span>

                {open && <div className="top-full right-0 absolute -mt-2 z-30">
                    <div className="px-2 py-1 rounded-md shadow bg-white text-gray-600">
                        <Link to={`/admin/challenges/edit/${challenge.id}`}>
                            <a className=" flex items-center outline-none focus:outline-none  mb-1 hover:text-primary-dark transition-all">
                                <span className="mr-1"><AiFillEdit /></span>
                                <span>Edit</span>
                            </a>

                        </Link>
                        {
                            
                           challenge.status[0] == 'a'?(
                            <>
                                <a onClick={(e) => { e.preventDefault(); onChangeStatus(Constants.CHALLENGE.UNACTIVE) }} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                                    <span className="mr-1"><IoMdPause/></span>
                                    <span>Unactive</span>
                                </a>
                                <a onClick={(e) => { e.preventDefault(); onChangeStatus(Constants.CHALLENGE.FINISHED) }} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                                    <span className="mr-1"><BsClockHistory/></span>
                                    <span>Finish</span>
                                </a>
                            </>
                            ):(
                                <a onClick={(e) => { e.preventDefault(); onChangeStatus(Constants.CHALLENGE.ACTIVE) }} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                                <span className="mr-1"><VscRunAll/></span>
                                <span>Active</span>
                                </a>
                            )
                        }
                         <a onClick={(e) => { e.preventDefault(); onClickDelete() }} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                            <span className="mr-1"><IoMdTrash /></span>
                            <span>Delete</span>
                        </a>
                    </div>
                </div>}
            </div>
        </OutsideClickDetect>

    </>)
}

const Challenge=()=>{
    const page_size = 10;
    const podcasts = useRef(PodcastHook.useAll());
    const [openFilter, setOpenFilter] = useState(false);
    const [selected_challenge, setSelectedChallenge] = useState<RawChallenge>();
    const [reload, setReload] = useState('');

    const location  = useLocation();
    const isMd = useMediaQuery({ query: MediaQuery.isMd }, undefined, (matches) => {

        if (matches) {
            console.log(matches)
            setOpenFilter(true);
        }
        else {
            console.log(matches)
            setOpenFilter(false);
        }
    });
    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/challenges/list', {
            ...Helper.getURLParams(),
            page_size: page_size,
        });
        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                return {
                    challenges: res.data.challenges,
                    challenge_num: res.data.challenge_num
                }
            }
        }

        return {
            challenges: [],
            challenge_num: 0
        }
    }, [Helper.setAndGetURLParam([]), reload]);

    UserHook.useFetchUsers(state.value ? state.value.challenges.map(e => e.user_id) : []);
    // PodcastHook.useFetchPodcasts(state.value ? getPodcastIdFromChallenges(state.value.challenges):[]);
    useEffect(()=>{
        if(state.value){
            const ids = getPodcastIdFromChallenges(state.value.challenges);
            const new_ids = [];
            for(let i in ids)if(!podcasts.current[ids[i]])new_ids.push(ids[i]);
            PodcastFunctions.loadPodcastByIds([...new Set(new_ids)]);
        }
    },[state.value]);

    return (
        <>
        <Meta title={`WELE | Challenge`} />
            <Link to='/admin/challenges/create'>
                <a className="fixed bottom-14 right-14 cursor-pointer px-2 py-2 text-white flex items-center justify-center bg-primary hover:bg-primary-dark rounded-full shadow-md text-2xl ">
                    <span><FaPlus /> </span>
                </a>
            </Link>
            <div className="flex md:none font-medium justify-end mb-8">
                <div onClick={() => setOpenFilter(true)}
                    className="flex cursor-pointer hover:text-primary fixed items-center">
                    <span>Lọc</span> <span><FiFilter /></span>
                </div>
            </div>
            <div className="w-full flex">
                <div className="w-full md:w-3/4 md:pr-7">
                    {
                        (state.loading) ? [1, 2, 3, 4, 5].map((e) => (
                            <div key={e} className="shadow rounded-md px-3 py-2 w-full mx-auto mb-2">
                                <div className="animate-pulse flex flex-col xs:flex-row space-x-3">
                                    <div className=" rounded bg-gray-200  h-24 xs:w-36 w-full"></div>
                                    <div className="flex-1 space-y-1 py-1">
                                        <div className="h-11 bg-gray-200 rounded w-full"></div>
                                        <div className="">
                                            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : ((state.value?.challenges as RawChallenge[]).length > 0 ? (state.value?.challenges as RawChallenge[]).map((challenge, index) => {
                            return (
                                <div key={challenge.id} className={challenge.status[0] == 'a' ?"bg-green-400 inline-block shadow hover:shadow-md  transition-all cursor-pointer rounded-md px-3 py-2 w-full mx-auto mb-2" 
                                :challenge.status[0] == 'f' ?"bg-red-400 inline-block shadow hover:shadow-md  transition-all cursor-pointer rounded-md px-3 py-2 w-full mx-auto mb-2":"inline-block shadow hover:shadow-md  transition-all cursor-pointer rounded-md px-3 py-2 w-full mx-auto mb-2"} >
                                <div className="flex space-x-3 flex-col xs:flex-row">
                                    <div  onClick={() => setSelectedChallenge(challenge)} className=" w-full xs:w-36 h-24  flex-shrink-0 flex items-center justify-center">
                                        {challenge.background_image ? <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + challenge.background_image})` }}
                                            className="rounded bg-gray-200 h-full w-full bg-center bg-cover">
                                        </div> : <span className=" text-6xl text-gray-200">
                                            <FaRegImage />
                                        </span>}
                                    
                                    </div>
                                    <div className="flex-1 flex py-1 relative">
                                        <div className="w-full" >
                                            <div className="text-sm w-full overflow-hidden ">
                                                <span className="text-primary text-sm xs:text-lg font-semibold"> {challenge.name}</span>
                                            </div>
                                            <div className="w-full flex justify-between">
                                                <p className=" text-sm text-b-500 font-light line-clamp-2">{Helper.extractContentByRegex(challenge.description)}</p>
                                            </div>
                                        </div>
                                        <div className="absolute  xs:block right-0 top-0 ">
                                            <SmallMenu challenge={challenge} reload={() => setReload(uuid.v4())}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )
                        }) : (<>
                            <div className="w-full px-5 py-5 text-center rounded-lg shadow">
                                <h5>Không có kết quả phù hợp</h5>
                            </div>
                        </>))
                    }
                    {state.value && state.value.challenge_num > page_size &&
                        // @ts-ignore
                        <div className="flex justify-center mt-10 mb-20"><Paginate num_items={state.value.challenge_num} page_size={page_size}  /> </div>
                    }
                </div>
                <div className=" w-0 md:w-1/4">
                    <ListFilter openFilter={openFilter || isMd} closeFilter={() => setOpenFilter(false)} url={"challenge"}/>
                </div>
            </div>

            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12"
                }}
                onClose={() => setSelectedChallenge(undefined)} open={!!selected_challenge}>
                <>
                    {selected_challenge && (
                        <ChallengeItem key={selected_challenge.id} challenge={selected_challenge}/>
                    )}
                </>
            </Modal>
        </>
    );
}

const PodcastItem = ({id,point}:{id:number,point:number})=>{
    const podcast = PodcastHook.usePodcast(id);
    return (
        <div className="flex ml-6">
            <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Name podcast:</label>
            <div className="ml-2 text-sm font-medium text-dark mb-1.5 block">{podcast.name}</div>
            <label className="ml-5 text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Point:</label>
            <div className="ml-2 text-sm font-medium text-dark mb-1.5 block">{point}</div>
        </div>
    )
}
const ChallengeItem  = ({challenge}:{challenge:RawChallenge})=>{
    const user = UserHook.useUser(challenge.user_id);
    const {team,limit_time,limit_podcast} = challenge.challenge_type;
    return (
        <div className="w-full flex flex-wrap">
        <div className="w-full">
            <div className="mt-2 ">
                <p className="mr-2 text-primary font-semibold text-lg" >{challenge.name}</p>
            </div>
            <div className="mt-2 ">
                <p className="mr-2 text-primary font-semibold text-lg" >Author:{user.fullname}</p>
            </div>
            <div className="mt-2 ">
                <p className="mr-2 text-primary font-semibold text-lg" >Create at :{Helper.getDateInputFormat(challenge.since)}</p>
            </div>
            <div className="mt-2 ">
                <p className="mr-2 text-primary font-semibold text-lg" >ID:{challenge.id}</p>
            </div>
            <div className="mt-2 ">
                <p className="mr-2 text-primary font-semibold text-lg" >Type:</p>
                {
                    team.status?(
                        <div className="mb-2">
                            <p className="ml-5 text-primary font-semibold text-lg">+Team</p>
                            <div className="flex">
                                <label className="ml-6 text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Number member:</label>
                                <div className="text-sm font-medium text-primary-dark mb-1.5 block">{challenge.challenge_type.team.number_member}</div>
                            </div>
                        </div>
                    ):""
                }
                {
                    limit_time.status?(
                        <div className="mb-2">
                            <p className="ml-5 text-primary font-semibold text-lg">+Limit Time</p>
                            <div className="flex">
                                <label className="ml-6 text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Time:</label>
                                <div className="ml-2 text-sm font-medium text-dark mb-1.5 block">{round(challenge.challenge_type.limit_time.value/3600)} hour  {(challenge.challenge_type.limit_time.value-round(challenge.challenge_type.limit_time.value/3600)*3600)/60} minute</div>
                            </div>
                        </div>
                    ):<p className="ml-5 text-primary font-semibold text-lg mb-2">+UnLimit Time</p>
                }
                {
                    limit_podcast.status?(
                        <div className="mb-2">
                            <p className="ml-5 text-primary font-semibold text-lg">+Limit Podcast</p>
                            {
                                limit_podcast.podcasts.map((e,index)=>{
                                    return <PodcastItem key={e.id} id={e.id} point={e.point}/>
                                })
                            }
                        </div>
                    ):<p className="ml-5 text-primary font-semibold text-lg mb-2">+Limit Podcast</p>
                }
            </div>
            <div className="mt-2 flex flex-wrap">
                <div className="flex-1">
                    <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Background Image</label>
                    <img className="w-full h-auto rounded-lg" src={Constants.IMAGE_URL + challenge.background_image} alt="" />
                </div>
            </div>
            <div className="mt-2">
                <label className="text-sm font-medium text-primary-dark mb-1.5 block" htmlFor="">Description</label>
                <div className="w-full">
                    <div className="font-sm bg-gray-50 px-1/5 py-1 rounded-lg">
                        {ReactHtmlParser(challenge.description)}
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
Challenge.layout=LAYOUT_TYPES.Admin;
export default Challenge;

// [The Five Love Languages - Ngôn ngữ tình yêu] Hello cả nhà, nhận thấy rất nhiều members đang đến độ tuổi xây dựng tổ ấm cho riêng mình, và việc hiểu được Love Language của partner (vợ/chồng của mình) là vô cùng quan trọng, admin Tien Nguyen đã tạo một series 6 bài nghe trên Spotlight về cuốn sách của Gary Chapman. Cả nhà cùng lắng nghe và học hỏi để hiểu hơn về cách khiến người yêu/bạn đời của mình hạnh phúc nhé. Bạn nào hoàn thành được challenge sẽ được chương trình gửi quyển sách ebook nha.