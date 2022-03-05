import { FaChevronRight, FaHeadphonesAlt, FaChevronLeft, FaUsers } from 'react-icons/fa'
import { Helper } from '../../services/Helper';

import SidebarChallenge from '../../components/sidebar/SidebarChallenge';
import { BsFilter } from 'react-icons/bs'
import { MdOutlineSecurity} from 'react-icons/md';
import {VscCompassActive} from 'react-icons/vsc'
import React, { useEffect, useMemo, useState } from 'react';

import { useAsync } from 'react-use';
import Fetch from '../../services/Fetch';
import Constants, { Code, FILLER_TEXT, MediaQuery, PostCastSubmitType } from '../../Constants';
import { RawPodcast, RawRecordChallengeUser,RawChallenge } from '../../store/types';
import {FcClock} from 'react-icons/fc'

import Paginate from '../../components/paginate/Paginate';
import { Toast } from '../../services/Toast';
// import Link from 'next/link';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import FilterTag from '../../page.components/challenges/FilterTag';
import HomeFooter from '../../components/footer/HomeFooter';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import ListFilter from '../../page.components/filter/_ListFilter';
import { AiOutlineCalendar, AiOutlineClockCircle } from 'react-icons/ai';
import { GrScorecard } from 'react-icons/gr';
import CountDown from '../../page.components/challenges/CountDown';

type ResponseType = {
    challenges: RawChallenge[],
    challenge_histories: RawChallenge[],
    challenge_actives: RawChallenge[],
    record_challenge_users: RawRecordChallengeUser[],
    challenge_member: {[challenge_id:number]:number}
    message: string,
    challenge_number: number,
    tags:string[],
    code: number,
}


const ListChallenges = () => {
    const page_size = 3;
    const [reload, setReload] = useState('');
    const [openSidebar, setOpenSidebar] = useState(true);
    const [is_joins, setIsJoins] = useState<{[id:number]:boolean}>({});
    const [page,setPage] = useState();
    useLocation();
    const me = MeHook.useMe();

    const state = useAsync(async () => {
        try {
            const res = await Fetch.postWithAccessToken<ResponseType>('/api/challenges/list', {
                ...Helper.getURLParams(),
                page_size: page_size
            });
            if (res.status == 200) {
                console.log(res.data);
                if (res.data && res.data.code == Code.SUCCESS) {
                    console.log(res.data);
                    const {record_challenge_users, challenges,challenge_number,challenge_histories,challenge_actives,challenge_member,tags} = res.data;
                    const is_joins = {} as {[id:number]:boolean};
                    
                    for(const record of record_challenge_users){
                        is_joins[record.challenge_id] = true;
                    }
                    for(const challenge of challenges){
                        if(!challenge_member[challenge.id]){
                            challenge_member[challenge.id] =challenge.data.member_number;
                        }
                    }
                    setIsJoins(is_joins);
                    setPage(Helper.getURLParams().page);
                    return {
                        challenges: challenges,
                        challenge_member:challenge_member,
                        challenge_histories: challenge_histories,
                        challenge_actives:challenge_actives,
                        challenge_number: challenge_number,
                        tags: tags
                    }
                }
                Toast.error(res.data.message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!!");
        }

        return {
            challenge_member:{},
            challenges: [],
            challenge_histories:[],
            challenge_actives:[],
            challenge_number: 0,
            tags:[]
        }
    }, [Helper.setAndGetURLParam([]), reload, me]);
    
    const [openFilter, setOpenFilter] = useState(false);
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

    return (
        <>
            <Meta />
            <div className="flex w-full items-stretch">
                <SidebarChallenge openSidebar={openSidebar} setOpenSidebar={(value) => setOpenSidebar(value)} />
                <div className="pt-16 pb-32 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10 xl:w-10/12 semi-md:w-4/5 w-full">
                    <div className="semi-md:none">
                        <div className="flex items-center" >
                            <span className="cursor-pointer text-xl pr-2 text-primary" onClick={() => setOpenSidebar(true)}><BsFilter /></span>
                            <span className="cursor-pointer text-xs font-semibold" onClick={() => setOpenSidebar(true)}>Filters</span>
                        </div>
                    </div>
                    <div className="list">
                        <div className="w-full mt-3">
                            <FilterTag />
                            <div className="w-full flex flex-wrap items-stretch mt-10">
                                {
                                    (state.loading) ? [1, 2, 3, 4, 5, 6, 7, 8, 9].map((e) => (
                                        <Replacement key={e} />
                                    )) : ((state.value && state.value.challenges) ? <>
                                         {
                                            state.value.challenge_actives && state.value.challenge_actives.length? (
                                                <div className='w-full'>
                                                    {
                                                          state.value.challenge_actives.map((challenge)=>{
                                                            return (<ChallengeActive key={challenge.id} challenge={challenge} is_join={is_joins[challenge.id]}  member_number={state.value.challenge_member[challenge.id]}/>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            ):""
                                        }
                                        {
                                            state.value.challenges && state.value.challenges.length ?(
                                                <div className="w-full">
                                                    <div className='flex justify-between items-center '>
                                                        <div className='font-semibold text-xl'>All challenge</div>
                                                       {
                                                            (!state.value.tags || !state.value.tags.includes("all") ) &&
                                                            <Link to={`/challenges?tags=all`}>
                                                                <div className='font-semibold text-red-400 text-lg cursor-pointer hover:text-red-500'>{`See more >>`}</div>
                                                            </Link>
                                                       }
                                                    </div>
                                                    <div className="w-full flex flex-wrap items-stretch mt-8 justify-start">
                                                        {
                                                            state.value.challenges.map((challenge) => {
                                                                return (
                                                                    <ChallengeItem key={challenge.id} challenge={challenge}  member_number={state.value.challenge_member[challenge.id]}/>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            ):""
                                        }
                                        {
                                            state.value.challenge_histories && state.value.challenge_histories.length? (
                                                <div className='w-full'>
                                                    <div className='flex justify-between items-center mt-8'>
                                                        <div className='font-semibold text-xl'>Your challenge's history</div>
                                                        {
                                                            (!state.value.tags || !state.value.tags.includes("history") ) &&
                                                            <Link to={`/challenges?tags=history`}>
                                                                <div className='font-semibold text-red-400 text-lg cursor-pointer hover:text-red-500'>{`See more >>`}</div>
                                                            </Link>
                                                        }
                                                    </div>
                                                    <div className="w-full flex flex-wrap items-stretch mt-8 justify-start">
                                                    {
                                                          state.value.challenge_histories.map((challenge)=>{
                                                            return (<ChallengeItem key={challenge.id} challenge={challenge} member_number={state.value.challenge_member[challenge.id]} />
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </div>
                                            ):""
                                        }
                                    </> : (<>
                                        <div className="w-full px-5 py-5 text-center rounded-lg shadow">
                                            <h5>No Results Found</h5>
                                        </div>
                                    </>))
                                }
                            </div>
                            {state.value && state.value.challenge_number > page_size &&
                                
                                <div className="w-full flex justify-center mt-7 md:mt-14"><Paginate num_items={state.value.challenge_number} page_size={page_size} current_page={page ? parseInt(page) : undefined}/> </div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex">
                <div className="xl:w-2/12 semi-md:w-1/5 w-0"></div>
                <div className="xl:w-10/12 semi-md:w-4/5 w-full">
                    <div
                        style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,.1), rgba(255,255,255,.1)), url('/static/footer.jpg')` }}
                        className="flex bg-center bg-cover">
                        <HomeFooter />
                    </div>
                </div>
            </div>
        </>
    )
}

const ChallengeItem = ({challenge,member_number}:{challenge:RawChallenge,member_number: number})=>{
    return (
        <div className="w-full md:w-1/3 mb-5 ">
            <div className="md:w-11/12 w-full flex md:flex-col box-border pt-2 pb-5 py-1  shadow-md hover:shadow-lg transition-all">
                <div className="max-h-24 bg-center flex-shrink-0 bg-contain bg-no-repeat md:w-full  sm:w-28 flex justify-center items-center overflow-hidden">
                    <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                        <img className="" src={`${Constants.IMAGE_URL+ challenge.background_image}`} alt="" />
                    </Link>
                </div>
                <div className=" ml-3 md:ml-0 md:mt-3 px-0 justify-items-start md:justify-between w-full ">
                    <div className="ml-5">
                        <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                            <div className="text-base font-medium text-blue-800 cursor-pointer block "> {challenge.name.length>=28?challenge.name.substring(0,26)+"..":challenge.name}</div>
                        </Link>
                        <div className='flex items-center mt-1'>
                            <div><AiOutlineCalendar/></div>
                            <div className='flex text-xs text-gray-600'>
                                <div className="ml-1">{Helper.getExactDay(challenge.start_time)}</div>
                                <div className="ml-1">- {Helper.getExactDay(challenge.end_time)}</div>
                            </div>
                        </div>
                        <div className='flex items-center mt-1'>
                            <div ><GrScorecard className='h-4'/></div>
                            <div className='text-xs text-gray-600 ml-2'>{Helper.extractContentByRegex(challenge.description)}</div>
                        </div>
                        <div className='flex items-center mt-1'>
                            <div><FaUsers/></div>
                            <div className='text-xs text-gray-600 ml-2'>{member_number} participants</div>
                        </div>
                        <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                            <div className='mr-5 mt-3'>
                                <button className='bg-green-700 font-medium text-white w-full rounded-[14px] text-sm py-1'>Detail</button>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

    )
}   

const ChallengeActive = ({challenge, is_join,member_number}:{challenge:RawChallenge,is_join: boolean,member_number:number})=>{
    
    return (
        <div className="w-full mb-10 ">
            <div className=" w-full flex  box-border shadow-md hover:shadow-lg transition-all border-2 border-gray-200">
                <div className=" ml-5 justify-items-start md:justify-between w-1/3 mt-3">
                    <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                        <div className="text-base font-medium text-blue-800 cursor-pointer block "> {challenge.name.length>=28?challenge.name.substring(0,26)+"..":challenge.name}</div>
                    </Link>
                    <div className='flex items-center mt-3'>
                        <div><AiOutlineClockCircle/></div>
                        <div className='text-sm ml-1 text-gray-600 w-full'>
                            <CountDown start_time={challenge.start_time} end_time={challenge.end_time}/>
                        </div>
                    </div>
                    <div className='flex items-center mt-2'>
                        <div><AiOutlineCalendar/></div>
                        <div className='flex text-xs text-gray-600'>
                            <div className="ml-1">{Helper.getExactDay(challenge.start_time)}</div>
                            <div className="ml-1">- {Helper.getExactDay(challenge.end_time)}</div>
                        </div>
                    </div>
                    <div className='flex items-center mt-2 '>
                        <div ><GrScorecard className='h-4'/></div>
                        <div className='text-xs text-gray-600 ml-1 mr-4'>{Helper.extractContentByRegex(challenge.description)}</div>
                    </div>
                    <div className='flex items-center mt-2'>
                        <div><FaUsers/></div>
                        <div className='text-xs text-gray-600 ml-1'>{member_number} participants</div>
                    </div>
                    <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                        <div className='mr-5 mt-5 mb-6'>
                            {
                                is_join 
                                    ? <button className='border-red-400 text-gray-800 border-2 w-full rounded-[14px] font-medium text-sm py-1 hover:text-black'>Joined</button>
                                    : <button className='bg-red-500 text-white w-full rounded-[14px] font-medium text-sm py-1 hover:bg-red-600'>Join challenge</button>
                            }
                        </div>
                    </Link>
                </div>
                <div className="bg-center flex-shrink-0 bg-contain w-2/3 bg-no-repeat  overflow-hidden ml-2 max-h-64">
                    <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                        <img  src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
                    </Link>
                </div>
            </div>
        </div>

    )
}
const Replacement = () => {
    return (
        <div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-7">
            <a className="w-full animate-pulse semi-xs:w-5/6 sm:w-3/4 md:w-11/12 2xl:w-10/12 mx-auto flex flex-col box-border px-3  pt-3 pb-4 shadow-md hover:shadow-xl rounded-lg transition-all">
                <div className="flex items-center md:items-stretch">
                    <div
                        className="flex-shrink-0 bg-gray-200 w-24 h-24 sm:w-28 sm:h-28 md:w-20  md:h-20 2xl:w-24 2xl:h-24 rounded-lg">
                    </div>
                    <div className="pl-3 flex-1 md:pl-2 flex flex-col">
                        <div className="w-full">
                            <div className="h-5 w-4/5  rounded bg-gray-200 ">

                            </div>
                        </div>

                        <div className="flex h-4 rounded-lg bg-gray-200 mt-2 h">
                        </div>
                        <div className="flex h-4 rounded-lg bg-gray-200 mt-2 h">
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
};

export default ListChallenges;