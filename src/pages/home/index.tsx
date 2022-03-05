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
import { Link } from 'react-router-dom';
import { Helper } from '../../services/Helper';
import { useMemo } from 'react';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import HomeFooter from '../../components/footer/HomeFooter';
import { Toast } from '../../services/Toast';
import { ChallengeFunctions } from '../../store/challenge/functions';

type ResponseType = {
	all_podcasts: RawPodcast[],
	recent_podcasts: RawPodcast[],
	new_podcasts: RawPodcast[],
	podcast_submits: RawPodcastSubmit[]
	code: number
}

const mapPodcast = (podcasts:RawPodcast[]) =>{
    const mapping = {}  as {[key:number]:RawPodcast};
	for(const podcast of podcasts)
        mapping[podcast.id] = podcast;
    return mapping;
}

const Home = () => {
	const [openSidebar, setOpenSidebar] = useState(true);
	const collections = PodcastCollectionHook.useAll();

	const me = MeHook.useMe();
	const state = useAsync(async () => {
		const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/home', {});
		if (res.status == 200) {
			if (res.data && res.data.code == Code.SUCCESS) {
				return {
					all_podcasts: res.data.all_podcasts,
					recent_podcasts: res.data.recent_podcasts,
					new_podcasts: res.data.new_podcasts,
					podcast_submits: res.data.podcast_submits
				}
			}
		}

		return {
			all_podcasts: [],
			recent_podcasts: [],
			new_podcasts: [],
			podcast_submits: []
		}
	}, [me]);

    const challenge_state = useAsync(async () => {
		try {
            const res = await Fetch.postWithAccessToken<{challenges: RawChallenge[], user_records: RawRecordChallengeUser[], podcasts:RawPodcast[], code: number, message:string}>('/api/challenges/home', {});
            if (res.status == 200) {
                if (res.data && res.data.code == Code.SUCCESS) {
					const {podcasts,challenges,user_records} = res.data;
					ChallengeFunctions.loadChallenges(challenges);
					const map_podcast = mapPodcast(podcasts);
                    return {
                        challenges: challenges,
						map_podcast: map_podcast,
                        user_records: user_records
                    }
                }
            }else{
                Toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            Toast.error("ERROR!!");
        }

		return {
			map_podcast:{} as {[key:number]:RawPodcast},
			challenges: [],
            user_records: []
		}
	}, [me]);

	return (<>
		<Meta />
		<div className="flex w-full items-stretch">
			<SidebarHome openSidebar={openSidebar} setOpenSidebar={(value) => setOpenSidebar(value)} />
			<div className="pt-16 pb-32 pl-5 sm:pl-10 pr-5 2xl:pr-20 sm:pr-10 xl:w-10/12 semi-md:w-4/5 w-full">
				<div className="semi-md:none">
					<div className="flex items-center" >
						<span className="cursor-pointer text-xl pr-2 text-primary" onClick={() => setOpenSidebar(true)}><BsFilter /></span>
						<span className="cursor-pointer text-xs font-semibold" onClick={() => setOpenSidebar(true)}>Filters</span>
					</div>
				</div>
				<div className="home container mx-auto">
                    <div className=" w-full mb-10 md:mb-6">
						<div className="w-full flex flex-swap items-stretch">
							{challenge_state.value && challenge_state.value.challenges.map((item,index) =><ChallengeItem key={item.id} challenge={item}  />)}
						</div>
					</div>
                    {
						challenge_state.value && challenge_state.value.challenges.map((challenge) =>{
							if(challenge.challenge_type.limit_podcast.status && challenge.start_time < Helper.time()){
								return (
									<div key={challenge.id} className="w-full mt-5">
										<div className="mb-4 w-full flex items-center justify-between">
											<h3 className=" text-base font-semibold">{challenge.name}</h3>
											{
												challenge.challenge_type.limit_podcast.podcasts.length > 6 &&
												<Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`} >
													<a className=" text-primary hover:text-primary-dark transition-all flex items-center text-sm">
														<span className="mr-1">See all</span>
														<span className=""><FaChevronRight /> </span>
													</a>
												</Link>
											}
										</div>
										<div className="w-full flex flex-wrap">
											{state.loading ?
												[1, 2, 3, 4, 5, 6].map((e) => <Replacement key={e} />) : (
													challenge.challenge_type.limit_podcast.podcasts.slice(0, 6).map(e => {
																return (
																	challenge_state.value && challenge_state.value.map_podcast[e.id] &&
																		<PodcastItem key={e.id} podcast={challenge_state.value.map_podcast[e.id]}/>
																)
														}))}
										</div>
									</div>
								)
							}
						})
					}
					<div className="w-full mt-3">
						{state.value && state.value.recent_podcasts.length > 0 && <div className="mb-4 w-full flex items-center justify-between">
							<h3 className=" text-base font-semibold">Recent Played</h3>
							<Link to={`/podcasts`} >
								<a className=" text-primary hover:text-primary-dark transition-all flex items-center text-sm">
									<span className="mr-1">See all</span>
									<span className=""><FaChevronRight /> </span>
								</a>
							</Link>
						</div>}
						<div className="w-full flex flex-wrap items-stretch">
							{
								state.loading ? [1, 2, 3].map((e) => <SmallReplacement key={e} />) : (<>
									{state.value && state.value.recent_podcasts.slice(0, 6)
										.map(podcast => <PodcastItem key={podcast.id} podcast={podcast} podcast_submits={state.value.podcast_submits} />)}
								</>)
							}
						</div>
					</div>
					<div className="w-full mt-10">
						<div className="mb-4 w-full flex items-center justify-between">
							<h3 className=" text-base font-semibold">New Released</h3>
							<Link to={`/podcasts`} >
								<a className=" text-primary hover:text-primary-dark transition-all flex items-center text-sm">
									<span className="mr-1">See all</span>
									<span className=""><FaChevronRight /> </span>
								</a>
							</Link>
						</div>
						<div className="w-full flex flex-wrap items-stretch">
							{state.loading ?
								[1, 2, 3].map((e) => <SmallReplacement key={e} />) : (<>
									{state.value && state.value.new_podcasts.slice(0, 3)
										.map(podcast => <BigPodcastItem key={podcast.id} podcast={podcast} collections={collections} />)
									}
								</>)}
						</div>
					</div>
					<div className="w-full mt-5">
						<div className="mb-4 w-full flex items-center justify-between">
							<h3 className=" text-base font-semibold">All podcasts</h3>
							<Link to={`/podcasts`} >
								<a className=" text-primary hover:text-primary-dark transition-all flex items-center text-sm">
									<span className="mr-1">See all</span>
									<span className=""><FaChevronRight /> </span>
								</a>
							</Link>
						</div>
						<div className="w-full flex flex-wrap">
							{state.loading ?
								[1, 2, 3, 4, 5, 6].map((e) => <Replacement key={e} />) : (
									state.value && state.value.new_podcasts.slice(0, 6)
										.map(podcast => <PodcastItem key={podcast.id} podcast={podcast} podcast_submits={state.value.podcast_submits} />))}
						</div>
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

interface PodcastItemProps {
	podcast: RawPodcast,
	collections?: RawPodcastCollection[],
	podcast_submits?: RawPodcastSubmit[]
}

const BigPodcastItem = ({ podcast, collections }: PodcastItemProps) => {

	var podcast_collections = (collections ? collections : []).filter(x => podcast.collections.includes(x.id.toString()));
	return (
		<div className="w-full md:w-1/3 mb-10 md:mb-6">
			<Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
				<a className=" 2xl:w-9/12 items-start md:w-11/12 w-full flex md:flex-col box-border pt-2 pb-5 px-3  py-1 hover:shadow-lg rounded-lg transition-all">
					<div
						className="max-h-32 bg-center flex-shrink-0 bg-contain bg-no-repeat md:w-full w-24  sm:w-28 rounded-lg flex justify-center items-center overflow-hidden">
						<img src={Constants.IMAGE_URL + podcast.image_url} alt="" />
					</div>
					<div className="flex ml-3 md:ml-0 md:mt-3 px-0 justify-items-start md:justify-between md:flex-row flex-col-reverse w-full ">
						<div className="">
							<h4 className="mb-0.5 mt-0 text-xs font-bold">ESL {podcast.sub_name}</h4>
							<p className="text-base text-gray-500 leading-5 line-clamp-2">
								{podcast.name}
							</p>
						</div>

						<div className="text-xs whitespace-nowrap mb-2 md:mb-0 md:ml-3 flex items-center">
							<span className="text-primary-dark bg-primary-light font-medium rounded px-1 py-1">
								{podcast_collections.length > 0 ? podcast_collections[0].name : "Tự do"}
							</span>
						</div>
					</div>
				</a>
			</Link>
		</div>
	);
};

const ChallengeItem = ({challenge}:{challenge:RawChallenge})=>{
    return (
        <div className = "w-full mt-4 cursor-pointer  relative" >
            <Link to={`/challenges/detail/${Helper.generateCode(challenge.name)}/${challenge.id}`}>
                <div className='w-full'>
                    <img className="h-64 w-full cursor-pointer" src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
                    <div className='absolute top-3/4 flex justify-center w-full'>
						<button className='text-white bg-red-700 px-4 py-1 rounded-full '>THAM GIA NGAY</button>
					</div>
                </div>
            </Link>
        </div>
    )
}

const PodcastItem = ({ podcast, podcast_submits }: PodcastItemProps) => {

	var podcast_submit = useMemo(() => {
		var submits = podcast_submits ? podcast_submits : [];
		return submits.find(e => e.podcast_id == podcast.id);
	}, [podcast, podcast_submits]);

	var percent_complete = useMemo(() => {
		if (podcast_submit) {
			var submit_words_num = podcast_submit.draft.replaceAll(FILLER_TEXT, "").replace(/\s+/g, " ").split(" ").length;
			var content_words_num = (podcast_submit.content ? podcast_submit.content : '').replaceAll(FILLER_TEXT, "").replace(/\s+/g, " ").split(" ").length;
			submit_words_num = submit_words_num > content_words_num ? submit_words_num : content_words_num;
			var words_num = podcast.result.replace(/\s+/g, " ").split(" ").length;

			if (podcast_submit.metatype == 'hint') {
				return Math.min(100, 100 * (submit_words_num - podcast.hint.length) / (words_num - podcast.hint.length));
			}

			return Math.min(100, 100 * (submit_words_num) / (words_num));
		}

		return 0;
	}, [podcast_submit, podcast]);

	return (<div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-6">
		<Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
			<a className="md:w-11/12 w-full flex items-center md:items-stretch box-border px-3  py-2 hover:shadow-lg rounded-lg transition-all">
				<div
					style={{
						backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`
					}}
					className="bg-center flex-shrink-0 bg-cover bg-no-repeat w-24 h-24 sm:w-28 sm:h-28 md:w-20  md:h-20 2xl:w-24 2xl:h-24 rounded-lg">

				</div>
				<div className="pl-3 w-full md:pl-2 flex flex-col justify-between">
					<div className="">
						<h4 className="mb-0.5 mt-0 text-xs font-bold">ESL {podcast.sub_name}</h4>
						<p className="text-base text-gray-500 leading-5 line-clamp-2">
							{podcast.name}
						</p>
						{podcast_submit && (<div className="relative pt-1">
							<div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${podcast_submit.status == PostCastSubmitType.SUBMITTED ? 'bg-red-600' : 'bg-gray-200'}`}>
								<div style={{ width: `${percent_complete}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
							</div>
						</div>)}

					</div>

					<div className="flex w-full justify-between mt-1">
						<div className="flex items-center text-xs">
							<span className="text-sm mr-1"><FaHeadphonesAlt /></span>
							<span className=" font-light">{podcast.views ? podcast.views : 0}</span>
						</div>
						<div className="flex items-center text-xs">
							<span className="text-sm mr-1 text-primary"><GrResources /></span>
							<span className=" font-light"> {PodcastSource[podcast.source_key].source_name} </span>
						</div>
					</div>
				</div>
			</a>
		</Link>
	</div>);
}


const SmallReplacement = () => {
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

export default Home;