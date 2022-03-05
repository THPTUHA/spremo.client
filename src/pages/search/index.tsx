import Constants, { Code, FILLER_TEXT, PodcastSource, PostCastSubmitType } from '../../Constants';
import React, { useEffect, useState } from 'react'
import { FaChevronRight, FaHeadphonesAlt } from 'react-icons/fa'
import { GrResources } from 'react-icons/gr'
import { PodcastCollectionHook } from "../../store/podcast.collection/hooks"
import { RawPodcast, RawPodcastCollection, RawPodcastSubmit ,RawChallenge, RawRecordChallengeUser, RawPodcastChallenge} from '../../store/types'
import { useAsync } from 'react-use';
import Fetch from '../../services/Fetch'
import SidebarHome from '../../components/sidebar/SidebarHome'
import { BsFilter } from 'react-icons/bs'
import { HiOutlineBadgeCheck } from 'react-icons/hi'
import {FcClock} from 'react-icons/fc'
// import Link from 'next/link';
import { Link, useParams } from 'react-router-dom';
import { Helper } from '../../services/Helper';
import { useMemo } from 'react';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import HomeFooter from '../../components/footer/HomeFooter';
import { Toast } from '../../services/Toast';
import Paginate from '../../components/paginate/Paginate';
import FilterTag from '../../page.components/search/FilterTag';
import SidebarChallenge from '../../components/sidebar/SidebarSearch';
import { MdOutlineSecurity } from 'react-icons/md';
import { VscCompassActive } from 'react-icons/vsc';
import {  Search } from '../../Constants';

type ResponseType = {
    podcasts: RawPodcast[],
    challenges: RawChallenge[],
	podcast_submits: RawPodcastSubmit[],
	records: RawRecordChallengeUser[],
	podcast_num: number,
	challenge_num: number,
    code: number,
}

const mapPodcastSubmit = (podcast_submits:RawPodcastSubmit[])=>{
	const mapping: {[key:number]:RawPodcastSubmit} = {};
	for(const podcast of podcast_submits)
		mapping[podcast.podcast_id] = podcast;
	return mapping;
}

const mapRecord = (records:RawRecordChallengeUser[])=>{
	const mapping: {[key:number]: boolean} = {};
	for(const {challenge_id} of records)
		mapping[challenge_id] = true;
	return mapping;
}

const SearchAll = () => {
	const page_size = 4;
	const [openSidebar, setOpenSidebar] = useState(true);
	const [page,setPage] = useState();
	const collections = PodcastCollectionHook.useAll();
	useParams();

    const me = MeHook.useMe();

    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/search/', {
			...Helper.getURLParams()
		});

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
				console.log(res.data);
                const {podcasts, challenges,podcast_submits,records, challenge_num, podcast_num} = res.data;
				const map_podcast_submit = mapPodcastSubmit(podcast_submits);
				const map_record = mapRecord(records);
				// for(const challenge of challenges)
				// 	challenge.is_join = map_record[challenge.id];
				// for(const podcast of podcasts)
				// 	podcast.podcast_submit = map_podcast_submit[podcast.id];
				setPage(Helper.getURLParams().page);
				return {
					podcasts: podcasts,
					challenges: challenges,
					is_podcast_result : podcasts.length,
					results_num : Math.max(challenge_num,podcast_num),
					is_challenge_result: challenges.length
				}
            }
        }

        return {
            podcasts: [],
			challenges: [],
			is_podcast_result: 0,
			is_challenge_result: 0,
			results_num: 0
        }
    }, [Helper.setAndGetURLParam([]), me]);
    
	return ( <>
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
								)) : (
									<>
									{
										(state.value?.is_podcast_result ||state.value?.is_challenge_result)
										? <div className='w-full'>
											{
												state.value.is_podcast_result?(
													<div className='w-full'>
														<div className='font-bold text-xl mb-4'>Podcast</div>
														<div className='flex w-full flex-wrap items-stretch'>
															{/* {
																(state.value?.podcasts as RawPodcast[]).map((podcast) => {
																	return (<PodcastItem key={podcast.id} podcast={podcast} />
																	)
																}) 
															} */}
														</div>
													</div>
												):""
											}
											{
												state.value.is_challenge_result?(
													<div className='w-full'>
														<div className='font-bold text-xl mb-4'>Challenge</div>
														<div className='flex w-full flex-wrap items-stretch'>
															{/* {
																(state.value?.challenges as RawChallenge[]).map((challenge) => {
																	return (<ChallengeItem key={challenge.id} challenge={challenge} />
																	)
																}) 
															} */}
														</div>
													</div>
												):""
											}
										</div>
										
										: (<>
											<div className="w-full px-5 py-5 text-center rounded-lg shadow">
												<h5>No Results Found</h5>
											</div>
										</>)
									}
									</>
								)
							}
						</div>

						{state.value &&  state.value.results_num > page_size &&
							//@ts-ignore
							<div className="w-full flex justify-center mt-7 md:mt-14"><Paginate num_items={state.value.results_num} page_size={page_size} current_page={page ? parseInt(page) : undefined} /> </div>}

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

	</>)
}
// const initStatus = (challenge:RawChallenge)=>{
// 	const time = Helper.time();
// 	return 	challenge.end_time<=time?Constants.CHALLENGE.FINISHED
// 			:challenge.start_time>time?Constants.CHALLENGE.COMING 
// 			:Constants.CHALLENGE.DURING;
// }

// const ChallengeItem = ({challenge}:{challenge:RawChallenge})=>{
// 	const status = initStatus(challenge);
// 	const [is_join, setIsJoin] = useState(challenge.is_join);
// 		const joinChallenge = async ()=>{
// 			const res = await Fetch.postWithAccessToken<{ code: number ,result:RawRecordChallengeUser,message:string}>("/api/challenges/join", {challenge_id:challenge.id});
// 			if (res && res.data) {
// 				if (res.data.code != Code.SUCCESS) {
// 					Toast.error(res.data.message)
// 					return;
// 				}
// 				else {
// 					setIsJoin(!is_join);
// 					Toast.success("Join Challenge Successful!")
// 					return;
// 				}
// 			}
// 		}

// 	return (
// 		<div className="w-full md:w-1/3 mb-10 md:mb-6">
// 			<div className=" 2xl:w-9/12 items-start md:w-11/12 w-full flex md:flex-col box-border pt-2 pb-5 px-3  py-1  shadow-md hover:shadow-lg rounded-lg transition-all">
// 				<div className="max-h-32 bg-center flex-shrink-0 bg-contain bg-no-repeat md:w-full w-24  sm:w-28 rounded-lg flex justify-center items-center overflow-hidden">
// 					<Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
// 						<img className="" src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
// 					</Link>
// 				</div>
// 				<div className=" ml-3 md:ml-0 md:mt-3 px-0 justify-items-start md:justify-between w-full ">
// 					<div className="ml-2">
// 						<div className="">
// 							<Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
// 								<div className="mb-0.5 mt-0 text-lg font-bold cursor-pointer"> {challenge.name}</div>
// 							</Link>
// 						</div>
// 						<div className="flex text-shadow items-center">
// 							<FcClock/>
// 							<div className="text-sm mt-1 ml-1">{Helper.getExactDay(challenge.start_time)}</div>
// 							<div className="text-sm mt-1">-{Helper.getExactDay(challenge.end_time)}</div>
// 						</div>
// 					</div>
// 					<div className='flex'>
// 						{
// 							status===Constants.CHALLENGE.COMING?(		
// 								<div className="flex justify-items-end ">
// 									{
// 										!is_join?(
// 											<button onClick={joinChallenge} className="outline-none w-24 ml-2 mt-1 focus:outline-none bg-green-500 text-white flex items-center justify-center py-1 rounded font-medium  shadow hover:bg-green-600 transition-all">Tham gia</button>
// 										):<span className="text-green-500 ml-2 font-medium  mt-1 mb-2">
// 											Đã tham gia
// 										</span>
// 									}
// 								</div>
// 							):status===Constants.CHALLENGE.FINISHED?(
// 								<div className="text-red-400 ml-2 font-medium mt-1 mb-2">Đã kết thúc</div>
// 							):(
// 								<div className="text-blue-400 ml-2 font-medium mt-1 mb-2">Đang diễn ra</div>
// 							)
// 						} 
// 						{
// 							challenge.status[0] == 'u' ? <div className = "flex items-center text-red-500 ml-2 font-medium">
// 								<MdOutlineSecurity/> <div>Unacitive</div>
// 							</div>:  challenge.status[0] == 'a' ? <div className = "flex items-center text-green-500 ml-2 font-medium">
// 								<VscCompassActive/> <div>Acitive</div>
// 							</div>:""
// 						}
// 					</div>
// 				</div>
// 			</div>
// 		</div>

// 	)
// }    

// const PodcastItem = ({podcast}: {podcast:RawPodcast}) => {

//     return (
//         <div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-7">
//             <Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}_${Helper.generateCode(podcast.sub_name)}/${podcast.id}`} >
//                 <a className="w-full h-full semi-xs:w-5/6 sm:w-3/4 md:w-11/12 2xl:w-10/12 mx-auto flex flex-col box-border px-3  pt-3 pb-4 shadow-md hover:shadow-xl rounded-lg transition-all">
//                     <div className="flex items-center md:items-stretch">
//                         <div
//                             style={{
//                                 backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`
//                             }}
//                             className="bg-center flex-shrink-0 bg-cover bg-no-repeat w-1/2 h-24 sm:h-28 md:h-20 2xl:h-24 rounded-lg">

//                         </div>
//                         <div className="pl-3 md:pl-2 flex-1 flex flex-col justify-between">
//                             <div className="">
//                                 <h4 className="mb-0.5 mt-0 text-base font-bold text-primary">ESL {podcast.sub_name}</h4>
//                                 <p className="text-base text-gray-900 line-clamp-2 leading-5 font-semibold">
//                                     {podcast.name}
//                                 </p>
//                                 {podcast.podcast_submit && (<div className="relative pt-1">
//                                     <div className={`overflow-hidden h-2 mb-1 text-xs flex rounded ${podcast.podcast_submit.status == PostCastSubmitType.SUBMITTED ? 'bg-red-700' : 'bg-gray-200'}`}>
//                                         <div style={{ width: `${Math.min(100*(podcast.podcast_submit.metatype=="hint"? podcast.podcast_submit.ans_hint/podcast.hint_size :(podcast.podcast_submit.ans_without_hint/podcast.result_size)),100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
//                                     </div>
//                                 </div>)}
//                             </div>

//                             <div className="flex w-full mt-2">


//                                 <div className="flex items-center text-xs mr-2">
//                                     <span className="text-sm mr-1"><FaHeadphonesAlt /></span>
//                                     <span className=" font-light">{podcast.views ? podcast.views : 0}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="mt-4">
//                         <p className="text-sm text-gray-500 font-light line-clamp-2">
//                             {Helper.extractContentByRegex(podcast.description)}
//                         </p>
//                     </div>
                   
//                 </a>
//             </Link>
//         </div>);
// };


const Replacement = () => {
	return (
		<div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-6">
			<a className="w-full animate-pulse semi-xs:w-5/6 sm:w-3/4 md:w-11/12 2xl:w-10/12 mx-auto flex flex-col box-border px-3  pt-1.5 pb-1.5 shadow-md hover:shadow-xl rounded-lg transition-all">
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
	);
}

export default SearchAll;
