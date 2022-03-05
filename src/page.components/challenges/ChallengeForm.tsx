import { ReactQuillNoSSR } from "../../components/form/NoSSR";
import Constants, { Code, LAYOUT_TYPES } from "../../Constants";
import { ChangeEvent, useState } from "react";
import { AiOutlineLoading3Quarters,AiFillDelete } from "react-icons/ai";
import { FaCheck, FaRegImage } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import ImageUploading,{ ImageListType } from "react-images-uploading";
import { useAsync } from "react-use";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";
import { RawChallenge, RawPodcast } from "../../store/types";
import {Link} from "react-router-dom";

type ResponseType = {
    podcasts: RawPodcast[],
    podcast_num: number,
    code: number
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

const getPodcastIdPoint = (podcasts:ListPodcast[])=>{
    return podcasts.map((e)=>{
        return {id:e.podcast.id,point:e.point};
    })
}
const Podcast = ({podcast}:{podcast:RawPodcast})=>{
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

interface ListPodcast {
    podcast : RawPodcast,
    point: any
}

interface DateTime{
    time_start: string,
    date_start: string,
    time_end: string,
    date_end: string
}

interface Data{
    challenge: RawChallenge,
    date_time: DateTime,
    list_podcast:ListPodcast[],
    hour_d: string,
    minute_d: string,
    is_create: boolean
}

const ChallengeForm = ({date_time,list_podcast,hour_d,minute_d ,challenge,is_create}:Data) => {
    const [name,setName] = useState<string>(challenge.name);
    const [date_time_challenge, setDateTimeChallenge] = useState(date_time);
    const [onLoading, setOnLoading] = useState(false);
    const [images, setImages] = useState<ImageListType>([]);
    const [search, setSearch] = useState<string>("");
    const [podcasts, setListPodcast] = useState<ListPodcast[]>(list_podcast);
    const [description, setDescription] = useState<string>(challenge.description);
    const [background_image, setBackgroundImage] = useState(challenge.background_image);
    
    const [team_status, setTeamStatus] = useState(challenge.challenge_type.team.status);
    const [number_member, setNumberMember] = useState(challenge.challenge_type.team.number_member+"");
    const [limit_time_status, setLimitTimeStatus] = useState(challenge.challenge_type.limit_time.status);
    const [limit_podcast_status, setLimitPodcastStatus] = useState(challenge.challenge_type.limit_podcast.status);
    const [hour,setHour] = useState(hour_d);
    const [minute, setMinute] = useState(minute_d);

    const hint = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/podcasts/list.admin', {
            q:search, page_size:2
        });

        if (res.status === 200) {
            if (res.data && res.data.code === Code.SUCCESS) {
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
    
            if (res.status === 200) {
                if (res.data && res.data.code === Code.SUCCESS) {
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
        setDateTimeChallenge(date_time_challenge);
        setDescription("");
        setListPodcast([]);
        setImages([]);
        setSearch("");
        setBackgroundImage("");
        setTeamStatus(false);
        setLimitPodcastStatus(false);
        setLimitTimeStatus(false);
    }
    const handleSubmit=async()=>{
        if (images.length === 0  && !background_image) {
            Toast.error("Image can not be empty!");
            return ;
        }
        let num_member = parseInt(number_member);
        console.log(num_member);
        if(team_status){
            if(!num_member){
                Toast.error("Number member invalid!");
                return ;
            }
        }
        
        if(limit_podcast_status){
            for(const {point} of podcasts){
                if(!checkNumber(point)){
                    Toast.error("Point podcast invalid!")
                    return;
                }
            }
        }

        let limit_time_value = 0;
        if(limit_time_status){
            if((!checkNumber(hour)||!checkNumber(minute))){
                Toast.error("Time limit invalid!");
                return;
            }
            limit_time_value = parseInt(hour)*3600+parseInt(minute)*60;
        }
        const start_time = Helper.getUnixNum(new Date(date_time_challenge.date_start+`T${date_time_challenge.time_start}`));
        const end_time = Helper.getUnixNum(new Date(date_time_challenge.date_end+`T${date_time_challenge.time_end}`));
        
        if(start_time >= end_time){
            Toast.error("Time Challenge invalid!")
            return ;
        }

        const challenge_type ={
            team : {
                status: team_status,
                number_member: num_member
            },
            limit_time: {
                status: limit_time_status,
                value: limit_time_value
            },
            limit_podcast:{
                status: limit_podcast_status,
                podcasts: limit_podcast_status? getPodcastIdPoint(podcasts):[]
            }

        }
        console.log(challenge_type);
        const data = { 
            id: challenge.id,
            name : name,
            start_time : start_time ,
            end_time : end_time ,
            image: images.length?images[0].file:background_image,
            description: description ,
            status:Constants.CHALLENGE.UNACTIVE,
            challenge_type: JSON.stringify(challenge_type)
        }
        console.log(data);
        setOnLoading(true);
        try{
            const url = is_create?"/api/challenges/create": "/api/challenges/update";
            console.log(url);
            // return ;
            const res: any = await Fetch.postWithAccessToken<{ challenge: RawChallenge, code: number }>(url, data)
            setOnLoading(false);
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    console.log(res.data.message);
                    return;
                }
                else {
                    Toast.success(is_create ? "Add challenge successful!" :"Save challenge successfull!");
                    resetAll();
                    return;
                }
            }

        }catch{
        }
    }

    const addPodcast = (podcast:ListPodcast)=>{
        setSearch("");
        setListPodcast([...podcasts,podcast]);
    }

    const deletePodcast = (index:number)=>{
       let temp = [...podcasts];
       temp.splice(index,1);
        setListPodcast(temp);
    }

    const setPoint = (index:number , point:any)=>{
        let temp = [...podcasts];
        temp[index].point = point;
        setListPodcast(temp);
    }

    const handleDateTimeChallenge = ( selection: string, value: string) => {
        setDateTimeChallenge({
            ...date_time_challenge,
            [selection]: value
        })
    };

    const handleTeam = ()=>{
      setTeamStatus(!team_status);
    }

    const handleTimeListen = ()=>{
        setLimitTimeStatus(!limit_time_status);
    }

    const handleLimitPodcast = ()=>{
        setLimitPodcastStatus(!limit_podcast_status);
    }
    
    return (<>
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
                                name="date_start"
                                onChange={(e)=>{handleDateTimeChallenge(e.target.name,e.target.value)}}
                                value={date_time_challenge.date_start}
                            />
                        </div>
                        <div className="flex-2 ml-5">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Time</label>
                                <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="time"
                                    name="time_start"
                                    onChange={(e)=>{handleDateTimeChallenge(e.target.name,e.target.value)}}
                                    value={date_time_challenge.time_start}
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
                                name="date_end"
                                onChange={(e)=>{handleDateTimeChallenge(e.target.name,e.target.value)}}
                                value={date_time_challenge.date_end}
                            />
                        </div>
                        <div className="flex-2 ml-5">
                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Time</label>
                                <input className="w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                    type="time"
                                    name="time_end"
                                    onChange={(e)=>{handleDateTimeChallenge(e.target.name,e.target.value)}}
                                    value={date_time_challenge.time_end}
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
                            <input 
                                type="checkbox"
                                onClick={handleTeam}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary"  name="type" />
                            <span className={!team_status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-full w-24">Team</label>
                    </div>
                    {
                        team_status?(
                            <div className="flex-2 ">
                            <label className="ml-6 text-base font-medium text-gray-600 w-24 " htmlFor="">Number member:</label>
                            <input onChange={(e)=>{setNumberMember(e.target.value)}} className="px-2 py-1 outline-none focus:outline-none  rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"
                                type="text"
                                placeholder="Number..."
                                value = {number_member}
                            />
                        </div>
                        ):""
                    }
            </div>
            <div className="w-full flex ">
                    <div className="flex items-center mr-8 mb-2">
                        <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                            <input id=""
                                onClick={handleTimeListen}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="type" />
                            <span className={!limit_time_status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-24">Limit Time</label>
                    </div>
                    {
                        limit_time_status && (
                            <div className="w-full flex ml-6">
                                <div>
                                    <label className="text-base font-medium text-gray-600 mb-1.5 " htmlFor="">Hour</label>
                                    <input className=" outline-none focus:outline-none w-20 ml-2 px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text"
                                    placeholder={"hour..."}
                                    onChange={(e)=>{setHour(e.target.value)}}
                                    value={hour}
                                    />
                                </div>
                                <div>
                                    <label className="text-base font-medium text-gray-600 mb-1.5 " htmlFor="">Minute</label>
                                    <input className=" outline-none focus:outline-none w-20 px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all"type="text"
                                    placeholder={"minute..."}
                                    onChange={(e)=>{setMinute(e.target.value)}}
                                    value={minute}
                                    />
                                </div>
                            </div>
                        )
                    }
            </div>
            <div className="w-full flex ">
                    <div className="flex items-center mr-8 mb-2">
                        <div className="relative mr-2 border-2 border-primary rounded-md px-0.5 py-0.5">
                            <input onClick={handleLimitPodcast}
                                className="absolute h-6 w-6 left-0 opacity-0 cursor-pointer top-0 nextOnChecked:text-primary" type="checkbox" name="type" />
                           <span className={!limit_podcast_status?"text-sm text-transparent transition-all":"text-sm  transition-all"}>
                                <FaCheck />
                            </span>
                        </div>
                        <label htmlFor="" className="font-medium text-gray-600 w-full w-36">Limit podcast</label>
                    </div>
            </div>
        </div>

        {
            limit_podcast_status && (
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
                                    <div key={podcast.id} onClick={()=>{addPodcast({podcast:podcast,point:0})}}>
                                        <Podcast  podcast ={podcast} />
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
                            podcasts.map((e,index)=>{
                                return (
                                <div key={index} className="mt-2 w-full outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-200 mr-3 border-4 border-transparent focus:border-primary transition-all">
                                    <div className="mt-2 flex w-full justify-around items-center">
                                        <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">{index+1}</label>
                                        <div className="w-8/12"><Podcast podcast={e.podcast} /></div>
                                        <div className="flex items-end mb-2">
                                            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Point</label>
                                            <input value={e.point} onChange={(e)=>{setPoint(index,e.target.value)}} placeholder="Point..."  className="h-10 w-20 ml-2 outline-none focus:outline-none px-2 py-1 rounded-lg bg-gray-50 mr-3 border-2 border-transparent focus:border-primary transition-all" type="text" name="point" id=""  />
                                        </div>
                                        <AiFillDelete onClick={()=>{deletePodcast(index)}} className="w-6 h-6 mb-2"/>
                                    </div>
                                </div>
                                )
                            })
                        }
                        </div>
                    </div>
                </div>
            )
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
            {onLoading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>} <span>{is_create?"Create Challenge":"Save"}</span>
        </button>
    </>)
}

export default ChallengeForm;