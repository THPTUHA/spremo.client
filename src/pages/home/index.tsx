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
// import Link from 'next/link';
import { Link } from 'react-router-dom';
import { Helper } from '../../services/Helper';
import { useMemo } from 'react';
import Meta from '../../components/ui/Meta';
import { MeHook } from '../../store/me/hooks';
import HomeFooter from '../../components/footer/HomeFooter';
import { Toast } from '../../services/Toast';

type ResponseType = {
	all_podcasts: RawPodcast[],
	new_podcasts: RawPodcast[],
	podcast_listens: RawPodcast[],
	podcast_submits: RawPodcastSubmit[],
	podcast_challenges: RawPodcastChallenge[],
	challenges: RawChallenge[],
	records: RawRecordChallengeUser[],
	code: number
}

const mapChallenge = (challenges: RawChallenge[])=>{
	return challenges.reduce((pre,cur,index)=>{
		return {...pre,[cur.id]:index};
	},{})as {[key:number]:number};
}

const mapChallengeByPodcastId = (challenges: RawChallenge[])=>{
	const mapping: {[key:number]:RawChallenge[]} = {};
	for(const item of challenges){
		if(item.start_time <= Helper.time()){
			const {podcast_ids} = item;
			for(const id of podcast_ids){
				const temp = mapping[id];
				if(temp) temp.push(item);
				else mapping[id] = [item];
			}
		}
	}
	return mapping;
}

const mapPodcastSubmit = (podcast_submits:RawPodcastSubmit[])=>{
	return podcast_submits.reduce((pre,cur)=>{
		return {...pre,[cur.podcast_id]:cur};
	},{})as {[key:number]:RawPodcastSubmit};
}

const mapPodcastChallenge = (podcast_challenges:RawPodcastChallenge[])=>{
	return podcast_challenges.reduce((pre,cur)=>{
		return {...pre,[cur.podcast_id+"#"+cur.challenge_id]:cur};
	},{})as {[key:string]:RawPodcastChallenge};
}

const getTypePodcast = (map_challenge_by_podcast:{[key:number]:RawChallenge[]},map_podcast_submit:{[key:number]:RawPodcastSubmit},podcasts:RawPodcast[] )=>{
	for(const podcast of podcasts){
		if(map_challenge_by_podcast[podcast.id]){
			podcast.challenges = map_challenge_by_podcast[podcast.id];
		}else{
			podcast.podcast_submit = map_podcast_submit[podcast.id];
		}
	}
}

const Home = () => {
	const [openSidebar, setOpenSidebar] = useState(true);
	const [is_joins, setIsJoins] = useState<{[id:number]:boolean}>({});
	const collections = PodcastCollectionHook.useAll();

	const me = MeHook.useMe();
	const state = useAsync(async () => {
		const res = await Fetch.postWithAccessToken<ResponseType>('/api/home/', {});
		if (res.status === 200) {
			if (res.data && res.data.code === Code.SUCCESS) {
				// console.log(res.data);				
				const {all_podcasts,podcast_challenges,new_podcasts,podcast_submits,challenges,podcast_listens,records} = res.data;
				const map_challenge =  mapChallenge(challenges);
				const map_podcast_submit = mapPodcastSubmit(podcast_submits);
				const map_podcast_challenge = mapPodcastChallenge(podcast_challenges);
				
				const map_challenge_by_podcast = mapChallengeByPodcastId(challenges);			
				getTypePodcast(map_challenge_by_podcast,map_podcast_submit,podcast_listens);
				getTypePodcast(map_challenge_by_podcast,map_podcast_submit,all_podcasts);
				getTypePodcast(map_challenge_by_podcast,map_podcast_submit,new_podcasts);

				for(const record of records){
					challenges[map_challenge[record.challenge_id]].is_join = true;
				}
				console.log(map_challenge_by_podcast);
				return {
					all_podcasts: all_podcasts,
					podcast_listens: podcast_listens,
					new_podcasts: new_podcasts,
					challenges: challenges,
					map_podcast_challenge: map_podcast_challenge
				}
			}
		}
		return {
			all_podcasts: [],
			new_podcasts: [],
			challenges: [],
			podcast_listens: [],
			map_podcast_challenge:{} as {[key:string]:RawPodcastChallenge}
		}
	}, [me]);

	useEffect(()=>{
		if(state.value){
			const {challenges} = state.value;
			const is_joins = {} as {[id:number]:boolean};
			for(const challenge of challenges){
				if(challenge.is_join){
					is_joins[challenge.id] = true;
				}
			}
			setIsJoins(is_joins);
		}
	},[state.value]);

	const joinChallenge =async (challenge:RawChallenge)=>{
		const res = await Fetch.postWithAccessToken<{ code: number ,result:RawRecordChallengeUser,message:string}>("/api/challenge/join", {challenge_id:challenge.id});
		if (res && res.data) {
			if (res.data.code != Code.SUCCESS) {
				Toast.error(res.data.message)
				return;
			}
			else {
				setIsJoins({...is_joins,[challenge.id]:true});
				Toast.success("Join Challenge Successful!")
				return;
			}
		}
	}

	const initStatus = (challenge:RawChallenge)=>{
		const time = Helper.time();
		return 	challenge.end_time<=time?Constants.CHALLENGE.FINSHED
				:challenge.start_time>time?Constants.CHALLENGE.COMING 
				:Constants.CHALLENGE.DURING;
	}

	const ChallengeItem = ({challenge, is_join,index}:{challenge:RawChallenge,is_join: boolean, index:number})=>{
		const status = initStatus(challenge);

		return (
			<div className="w-full mb-10 md:mb-6 ">
				<div className=" 2xl:w-9/12 items-start md:w-11/12 w-full flex md:flex-col box-border pt-2 pb-5 px-3  py-1  shadow-md hover:shadow-lg rounded-lg transition-all">
					<div className="w-full">
						<Link to={`/challenge/detail/${challenge.id}`}>
							<img className="h-64 w-full rounded-lg cursor-pointer" src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
						</Link>
					</div>
					<div className="flex ml-3 md:ml-0 md:mt-3 px-0 justify-items-start md:justify-between md:flex-row flex-col-reverse w-full ">
						<div className="ml-2">
							<div className="">
								<Link to={`/challenge/detail/${challenge.id}`}>
									<div className="mb-0.5 mt-0 text-lg font-bold cursor-pointer"> {challenge.name}</div>
								</Link>
							</div>
							<div className="flex text-shadow">
								<div className="">Thời gian diễn ra:</div>
								<div className="text-sm mt-1 ml-1">{Helper.getExactDay(challenge.start_time)}</div>
								<div className="text-sm mt-1">-{Helper.getExactDay(challenge.end_time)}</div>
							</div>
						</div>
						{
							status===Constants.CHALLENGE.COMING?(		
								<div className="flex justify-items-end ">
									{
										!is_join?(
											<button onClick={()=>{joinChallenge(challenge)}} className="outline-none w-24 mr-2 focus:outline-none bg-green-500 text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-green-600 transition-all">Tham gia</button>
										):<span className="text-green-500  font-medium mr-2 mt-1">
											Đã tham gia
										</span>
									}
								</div>
							):status===Constants.CHALLENGE.FINSHED?(
								<div>Đã kết thúc</div>
							):(
								<div>Đang diễn ra</div>
							)
						} 
					</div>
				</div>
			</div>
		)
	}
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
							{state.value && state.value.challenges.map((item,index) =><ChallengeItem key={item.id} challenge={item} is_join={is_joins[item.id]} index={index} />)}
						</div>
					</div>
					<div className="w-full mt-3">
						{state.value && state.value.podcast_listens.length > 0 && <div className="mb-4 w-full flex items-center justify-between">
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
									{state.value && state.value.podcast_listens.slice(0,6)
										.map(podcast =>{
											return <PodcastItem key={podcast.id} podcast={podcast} map_podcast_challenge={state.value.map_podcast_challenge}/>
										})}
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
										.map(podcast => <BigPodcastItem key={podcast.id} podcast={podcast} collections={collections}/>)
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
									state.value && state.value.all_podcasts
										.map(podcast => {
												return <PodcastItem key={podcast.id} podcast={podcast} map_podcast_challenge={state.value.map_podcast_challenge}/>
										}))}
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
	podcast_submits?: RawPodcastSubmit[],
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
						<div className='flex flex-col'>
							{
								podcast.challenges?.map((challenge)=>{
									return (
										challenge.start_time <= Helper.time()?(
											<div key={challenge.id} className='flex text-green-500 items-center'>
												<HiOutlineBadgeCheck/>
												<div>{challenge.name}</div>
											</div>
										):""
									)
								})
							}
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

const PodcastItem = ({podcast,map_podcast_challenge}:{podcast:RawPodcast, map_podcast_challenge:{[key:string]:RawPodcastChallenge}})=>{
	return (
	<div className="w-full md:w-1/2 semi-lg:w-1/3 mb-10 md:mb-6">
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
						{
							podcast.challenges? podcast.challenges.map(({id,name,start_time})=>{
								return (
									start_time <= Helper.time()?(
										<div key={id}>
											<div className='flex text-green-500 items-center'>
												<HiOutlineBadgeCheck/>
												<div>{name}</div>
											</div>
											{map_podcast_challenge[podcast.id+"#"+id] &&<div className="relative pt-1">
												<div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${map_podcast_challenge[podcast.id+"#"+id].is_submitted ? 'bg-red-600' : 'bg-gray-200'}`}>
													<div style={{ width: `${Math.min(100*(map_podcast_challenge[podcast.id+"#"+id].metatype=="hint"?map_podcast_challenge[podcast.id+"#"+id].ans_hint/podcast.hint_size :(map_podcast_challenge[podcast.id+"#"+id].ans_without_hint/podcast.result_size)),100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
												</div>
											</div>}
										</div>
									):""
								)
							}): podcast.podcast_submit && (
								<div className="relative pt-1">
									<div className={`overflow-hidden h-2 mb-4 text-xs flex rounded ${podcast.podcast_submit.status === PostCastSubmitType.SUBMITTED  ? 'bg-red-600' : 'bg-gray-200'}`}>
										<div style={{ width: `${Math.min(100*(podcast.podcast_submit.metatype=="hint"? podcast.podcast_submit.ans_hint/podcast.hint_size :(podcast.podcast_submit.ans_without_hint/podcast.result_size)),100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
									</div>
								</div>
							)
						}
					</div>

					<div className="flex w-full justify-between mt-1">
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
