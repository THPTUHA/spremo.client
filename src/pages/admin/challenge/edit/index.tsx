import { ReactQuillNoSSR } from "../../../../components/form/NoSSR";
import { GetServerSideProps} from "next";
import Constants, { Code, LAYOUT_TYPES } from "../../../../Constants";
import { useState ,useEffect, useRef} from "react";
import { AiOutlineLoading3Quarters,AiFillDelete } from "react-icons/ai";
import { FaCheck, FaRegImage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import ImageUploading,{ ImageListType } from "react-images-uploading";
import { useAsync } from "react-use";
import Fetch from "../../../../services/Fetch";
import { Helper } from "../../../../services/Helper";
import { Toast } from "../../../../services/Toast";
import { RawChallenge, RawPodcast, RawRecordChallengeUser } from "../../../../store/types";
import { round } from "lodash";
import {useParams ,Link} from "react-router-dom";
import { PodcastHook } from "../../../../store/podcast/hooks";
import { PodcastFunctions } from "../../../../store/podcast/functions";

type ResponseType = {
    podcasts: RawPodcast[],
    podcast_num: number,
    code: number
}

type PodcastPoint = {
    id:number,
    point: number
}

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent'
]

const checkNumber = (n:any)=>{
    for(let i in n) if(n[i]<'0'||n[i]>'9')return false;
    return n.length > 0; 
}

const Podcast = ({id}:{id:number})=>{
    const podcast = PodcastHook.usePodcast(id);
    return (
        <div className=" shadow hover:shadow-md transition-all cursor-pointer rounded-md px-3 py-2 w-full mx-auto mb-2">
        <div className="flex space-x-3 flex-col xs:flex-row">
            <div  className=" w-full xs:w-12 h-12  flex-shrink-0 flex items-center justify-center">
                {podcast.image_url ? <div style={{ backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})` }}
                    className="rounded bg-gray-200 h-full w-full bg-center bg-cover">
                </div> : <span className=" text-6xl text-gray-200">
                    <FaRegImage />
                </span>}

            </div>
            <div className="flex-1 flex py-1 relative">
                <div className="w-full">
                    <div className="text-sm w-full overflow-hidden ">
                        <Link to={`/podcasts/detail/${podcast.name}/${podcast.id}`}>
                            <span className="text-primary text-sm xs:text-lg font-semibold hover:text-orange-500"> {podcast.name}</span>
                        </Link>
                        <span className="text-gray-900 text-sm xs:text-lg font-semibold"> {podcast.sub_name}</span>
                    </div>
                    <div className="w-full flex justify-between">
                        <p className=" text-sm text-gray-500 font-light line-clamp-2">{Helper.extractContentByRegex(podcast.description)}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

const Edit = () => {
    const {id} = useParams();
    const podcasts = useRef(PodcastHook.useAll());
    const [challenge,setChallenge] = useState<RawChallenge>();
    const [name,setName] = useState<string>("");
    const [start_challenge_date, setStartChallengeDate] = useState<number>(0);
    const [start_challenge_time ,setStartChallengeTime] = useState<string>("00:00");
    const [end_challenge_date, setEndChallengeDate] = useState<number>(0);
    const [end_challenge_time ,setEndChallengeTime] = useState<string>("00:00");
    const [onLoading, setOnLoading] = useState(false);
    const [images, setImages] = useState<ImageListType>([]);
    const [search, setSearch] = useState<string>("");
    const [podcasts_point, setPodcastsPoint] = useState<PodcastPoint[]>([]);
    const [description, setDescription] = useState<string>("");
    const [background_image,setBackground_image] =useState<string>("");

    const [team, setTeam] = useState<any>();
    const [limit_time, setLimitTime] = useState<any>();
    const [limit_podcast, setLimitPodcast] = useState<any>();
    const [hour,setHour] = useState<string>("");
    const [minute, setMinute] = useState<string>("");
    
    useEffect(()=>{
        (async()=>{
            const res = await Fetch.postJsonWithAccessToken<{challenge:RawChallenge}>('/api/challenge/detail', {
                id:id
            });
            const challenge = res.data.challenge;
            const {limit_podcast,team,limit_time} = challenge.challenge_type;
            const ids = limit_podcast.podcasts.map((e)=>e.id);
            await PodcastFunctions.loadPodcastByIds(ids);
            setChallenge(challenge);
            setName(challenge.name);
            setStartChallengeDate(challenge.start_time);
            setEndChallengeDate(challenge.end_time);
            setDescription(challenge.description);
            setBackground_image(challenge.background_image);
            setPodcastsPoint(limit_podcast.podcasts);
            setTeam(team);
            setLimitTime(limit_time);
            setLimitPodcast(limit_podcast);
            setStartChallengeTime(Helper.getHourMinute(challenge.start_time));
            setEndChallengeTime(Helper.getHourMinute(challenge.end_time));
            setHour(round(limit_time.time/3600)+"");
            setMinute((limit_time.time-round(limit_time.time/3600)*3600)/60+"");
        })();
    },[])

    const hint = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/list.admin', {
            q:search, page_size:2
        });

        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                return {
                    podcasts: res.data.podcasts,
                    podcast_num: res.data.podcast_num
                }
            }
        }
        return {
            podcasts: [],
            podcast_num: 0
        }
    }, []);

    const status = useAsync(async () => {
        if(search != ""){
            const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/list.admin', {
                q:search, page_size:10
            });
    
            if (res.status == 200) {
                if (res.data && res.data.code == Code.SUCCESS) {
                    await PodcastFunctions.loadRawPodcasts(res.data.podcasts);
                    return {
                        podcasts: res.data.podcasts,
                        podcast_num: res.data.podcast_num
                    }
                }
            }
        }
        return {
            podcasts: [],
            podcast_num: 0
        }
    }, [search]);
    const onImageSelectChange = (
        imageList: ImageListType,
    ) => {
        setImages(imageList as never[]);
    };

    const resetAll = ()=>{
        setName("");
        setStartChallengeDate(Helper.getUnixNum());
        setStartChallengeTime("00:00");
        setEndChallengeDate(Helper.getUnixNum());
        setEndChallengeTime("00:00");
        setDescription("");
        setPodcastsPoint([]);
        setImages([]);
        setSearch("");
        setBackground_image("");
        setTeam({status:false , number_member:0});
        setLimitPodcast({status:false , podcasts:[]});
        setLimitTime({status:false , time:0});
    }
    const handleSubmit=async()=>{
        let check = true;
        if ( !images.length && !background_image) {
            Toast.error("Image can not be empty!")
        }

        podcasts_point.forEach((e)=>{
            if(!checkNumber(e.point)){
                Toast.error("Point podcast invalid!")
                check = false;
                return;
            }
        })
        if(limit_time.status){
            if(!checkNumber(hour)||!checkNumber(minute)){
                Toast.error("Time limit invalid!");
                check=false;
            }else{
                limit_time.time =parseInt(hour)*3600+parseInt(minute)*60;
            }
        }
        const start_time = Helper.getUnixNum(new Date(Helper.getDateInputFormat(start_challenge_date)+`T${start_challenge_time}`));
        const end_time = Helper.getUnixNum(new Date(Helper.getDateInputFormat(end_challenge_date)+`T${end_challenge_time}`))
        
        if(start_time >= end_time){
            Toast.error("Time Challenge invalid!")
            check = false;
        }
        if(!check) return;

        const challenge_type ={
            team : team,
            limit_time:limit_time,
            limit_podcast:{...limit_podcast,podcasts:podcasts_point}
        }
        console.log(challenge_type);
        console.log(images.length);
        const data = { 
            id:id,
            name : name,
            start_time : start_time ,
            end_time : end_time ,
            image: images.length?images[0].file:background_image,
            description: description ,
            challenge_type: JSON.stringify(challenge_type)
        }
        console.log(data);
        setOnLoading(true);
        try{
            const res: any = await Fetch.postWithAccessToken<{ challenge: RawChallenge, code: number }>("/api/challenge/update", data)
            setOnLoading(false);
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    console.log(res.data.message);
                    return;
                }
                else {
                    Toast.success("Save Challenge Successful!")
                    resetAll();
                    return;
                }
            }

        }catch{
        }
    }

    const addPodcast = (podcast_point:PodcastPoint)=>{
        setSearch("");
        setPodcastsPoint([...podcasts_point,podcast_point]);
    }

    const deletePodcast = (index:number)=>{
       let temp = [...podcasts_point];
       temp.splice(index,1);
       setPodcastsPoint(temp);
    }

    const setPoint = (index:number , point:any)=>{
        let temp = [...podcasts_point];
        temp[index].point = point;
        setPodcastsPoint(temp);
    }

    const onChangeDate = (e: any,status:any) => {
       status ? setStartChallengeDate(Helper.getUnixNum(e.target.value))
            :setEndChallengeDate(Helper.getUnixNum(e.target.value));
    };
    const onChangeTime = (e: any,status:any) => {
        status?setStartChallengeTime(e.target.value)
            :setEndChallengeTime(e.target.value);
    };

    const handleTeamChallengeType = (e:any,click:boolean)=>{
        click?setTeam({...team,status:!team.status})
             :setTeam({...team,number_member:e.target.value})
    }

    const handleLimitTimeChallengeType = (e:any,click:boolean)=>{
        click?setLimitTime({...limit_time, status:!limit_time.status})
             :setLimitTime({...limit_time, time:e.target.value});
    }

    const handleLimitPodcastChallengeType = (e:any)=>{
        setLimitPodcast({...limit_podcast,status:!limit_podcast.status});
    }

    const handleNumberMemberTeamChallengeType = (e:any)=>{
        setTeam({...team,number_member:e.target.value});
    }
    return (<>
    {challenge&&team&&limit_podcast&&limit_time&&background_image?(
        <>
        <div className="outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-100 border-4 border-transparent focus:border-primary transition-all">
        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Challenge Name</label>
            <input type="text"  value={name} onChange={(e)=>{setName(e.target.value)}} className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"  name="name" id="" placeholder="Challenge name..." />
        </div>
        <div className="mt-2 flex w-full justify-between outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-100  border-4 border-transparent focus:border-primary transition-all">
        <div className="outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-200  border-4 border-transparent focus:border-primary transition-all">
            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Start Challenge</label>
                <div className="mt-2 flex ">
                    <div className="flex-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Date</label>
                            <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                type="date"
                                name="since"
                                placeholder={"date"}
                                onChange={(e)=>{onChangeDate(e,1)}}
                                value={Helper.getDateInputFormat(start_challenge_date)}
                            />
                        </div>
                        <div className="flex-2 ml-5">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Time</label>
                                <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="time"
                                    name="since"
                                    placeholder={"time"}
                                    onChange={(e)=>{onChangeTime(e,1)}}
                                    value={start_challenge_time}
                                />
                        </div>
                </div>
        </div>
       
        <div className=" outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-200  border-4 border-transparent focus:border-primary transition-all">
            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">End Challenge</label>
                <div className="mt-2 flex ">
                    <div className="flex-2">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Date</label>
                            <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                type="date"
                                name="since"
                                placeholder={"date"}
                                onChange={(e)=>{onChangeDate(e,0)}}
                                value={Helper.getDateInputFormat(end_challenge_date)}
                            />
                        </div>
                        <div className="flex-2 ml-5">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Time</label>
                                <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="time"
                                    name="since"
                                    placeholder={"time"}
                                    onChange={(e)=>{onChangeTime(e,0)}}
                                    value={end_challenge_time}
                                />
                        </div>
                </div>
        </div>
    </div>

        <div className="outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-100 mt-2 border-4 border-transparent focus:border-primary transition-all">
            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Type Challenge</label>
                <div className="w-full flex ">
                    <div className="flex items-center mr-8 mb-2">
                        <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                            <input id=""
                                onClick={(e)=>{handleTeamChallengeType(e,true)}}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="type" />
                            <span className={!team.status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-full w-24">Team</label>
                    </div>
                    {
                        team.status?(
                            <div className="flex-2 mb-2 ">
                            <label className="ml-6 text-base font-medium text-gray-600 w-24 " htmlFor="">Number member:</label>
                            <input onChange={(e)=>{handleTeamChallengeType(e,false)}} className="px-2 py-1 outline-none focus:outline-none  rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                type="text"
                                placeholder="Number..."
                                value = {team.number_member}
                            />
                        </div>
                        ):""
                    }
            </div>
            <div className="w-full flex ">
                    <div className="flex items-center mr-8 mb-2">
                        <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                            <input id=""
                                onClick={(e)=>{handleLimitTimeChallengeType(e,true)}}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="type" />
                            <span className={!limit_time.status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-24">Limit time</label>
                    </div>
                    
                    {
                        limit_time.status?(
                            <div className="w-full flex ml-5">
                                <div>
                                    <label className="text-base font-medium text-gray-600 mb-1.5 " htmlFor="">Hour</label>
                                    <input className=" outline-none focus:outline-none w-20 px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="text"
                                    name="since"
                                    placeholder={"hour..."}
                                    onChange={(e)=>{setHour(e.target.value)}}
                                    value={hour}
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-medium text-gray-600 mb-1.5 " htmlFor="">Minute</label>
                                    <input className=" outline-none focus:outline-none w-20 px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="text"
                                    name="since"
                                    placeholder={"minute..."}
                                    onChange={(e)=>{setMinute(e.target.value)}}
                                    value={minute}
                                    />
                                </div>
                            </div>
                        ):""
                    }
            </div>
            <div className="w-full flex ">
                    <div className="flex items-center mr-8 mb-2">
                        <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                            <input id=""
                                onClick={handleLimitPodcastChallengeType}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="type" />
                            <span className={!limit_podcast.status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-full w-24">Limit podcast</label>
                    </div>
            </div>
        </div>

        {
            limit_podcast.status?(
                <div>
                    <div  className="outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-100 mt-2 border-4 border-transparent focus:border-primary transition-all">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Search podcast</label>
                        <div className="mt-2 flex ">
                                <label  className="mt-2" htmlFor="search"><IoSearch/></label>
                                <input  type="text"  value={search} onChange={(e)=>{setSearch(e.target.value)}}placeholder="Search..." name="search" className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 border-2 border-transparent focus:border-primary transition-all"   id=""  />
                    </div>
                    <p className="text-sm font-medium text-red-400 mb-1.2 block">*You can search by name or sub-name podcast:</p>
                            {hint.value?.podcasts.map((e,index)=><div key={index} className="text-sm font-medium text-gray-600 mb-1.5 block"><span className="text-gray-500">{e.name}</span> or <span className="text-gray-600">{e.sub_name}</span></div>)}
                    </div>
                    {
                        status.loading?( <div className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></div>)
                            : status.value?.podcast_num?(
                                ( status.value?.podcasts as RawPodcast[]).map((podcast,index)=>{
                                return (
                                    <div key={podcast.id} onClick={()=>{addPodcast({id:podcast.id,point:0})}}>
                                        <Podcast  id={podcast.id} />
                                    </div>
                                )})
                            ):search?(
                                <div className="text-sm font-medium text-gray-800 mb-1.2 block">Not found</div>
                            ):""
                    }
                    <div className="outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-100 mt-2 border-4 border-transparent focus:border-primary transition-all">
                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">List Podcast</label>
                        <div >
                            {
                            podcasts_point.map((e,index)=>{
                                return (
                                <div key={index} className="mt-2 w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-200 mr-3 border-4 border-transparent focus:border-primary transition-all">
                                    <div className="mt-2 flex w-full justify-around items-center">
                                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">{index+1}</label>
                                        <div className="w-8/12"><Podcast id={e.id} /></div>
                                        <div className="flex items-end mb-2">
                                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Point</label>
                                            <input value={e.point} onChange={(e)=>{setPoint(index,e.target.value)}} placeholder="Point..."  className="h-10 w-20 ml-2 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text" name="point" id=""  />
                                        </div>
                                        <AiFillDelete onClick={()=>{deletePodcast(index)}} className="w-6 h-6 mb-2 cursor-pointer"/>
                                    </div>
                                </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            ):""
        }

    
    
    <div>
     <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Background </label>
        <ImageUploading
                value={images}
                onChange={onImageSelectChange}
                maxNumber={1}
                dataURLKey="data_url"
            >
                {({
                    imageList,
                    onImageUpload,
                    onImageUpdate,
                    isDragging,
                    dragProps,
                }) => (
                    <div className="upload__image-wrapper">
                        <button
                            className={` ${images.length > 0 && "none"} text-base outline-none focus:outline-none outline-none w-20 focus:outline-none  `}
                            style={isDragging ? { color: 'red' } : undefined}
                            onClick={onImageUpload}
                            {...dragProps}
                        >
                            {background_image ? <>
                                    <span>Upload</span>
                                    <img src={`${Constants.IMAGE_URL + background_image}`} alt="" />
                                </> : "Upload"}
                        </button>
                        {imageList.map((image, index) => (
                            <div key={index} className="flex">
                                <div
                                    className=" overflow-hidden rounded-md shadow relative">
                                    <img src={`${image['data_url']}`} alt="" />
                                    <div className="absolute flex items-center top-3 right-1">
                                        <span onClick={() => onImageUpdate(index)} className=" cursor-pointer px-1.5 py-1.5 mr-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                                            <FiEdit />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ImageUploading>
        </div>
        <div className="mt-2">
            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Description</label>
            <div className="w-full sm:mb-0 mb-14">
                <ReactQuillNoSSR theme="snow"
                    modules={modules}
                    formats={formats}
                    className=" h-full w-full pb-10"
                    value={description} onChange={setDescription} />
            </div>
         </div>
        <button
            onClick={handleSubmit}
            className="outline-none w-36 focus:outline-none bg-primary text-white flex mb-6 items-center justify-center py-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
            {onLoading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>} <span>Save Challenge</span>
        </button>
        </>):""}
    </>)
}


Edit.layout=LAYOUT_TYPES.Admin;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJsonWithAccessToken<any>('/api/challenge/detail', {
//         id: context.params ? (context.params)['id'] : 0
//     })
//     return {

//         props: { challenge: res.data.challenge },
//     }
// }

export default Edit;