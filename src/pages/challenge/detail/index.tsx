import { GetServerSideProps } from "next";
import {useState ,useEffect} from "react";
import Constants, { Code } from '../../../Constants';
import { RawChallenge, RawPodcast, RawPodcastChallenge, RawRecordChallengeUser } from "../../../store/types";
import Fetch from "../../../services/Fetch";
import { UserHook } from "../../../store/user/hooks";
import { Helper } from '../../../services/Helper';
import Avatar from "../../../components/ui/Avatar";
import {BiTime} from "react-icons/bi";
import {BsArrowLeftCircle ,BsArrowRightCircle} from "react-icons/bs";
import { Toast } from '../../../services/Toast';
import { useAsync } from 'react-use';
//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
import { Link, useParams } from "react-router-dom";
import { GiArcheryTarget } from "react-icons/gi";
import { GrScorecard } from "react-icons/gr";
import { MdIncompleteCircle } from "react-icons/md";


const UserItem = ({record,index, podcasts}:{record: RawRecordChallengeUser,index :number,podcasts:RawPodcast[] }) => {
    const user = UserHook.useUser(record.user_id);
    const [open,setOpen] = useState(false);
    // console.log(record);
    return (
        <>
            {user && <div className='relative w-full py-1 ml-3 hover:bg-gray-100 rounded-md' onMouseOver={()=>{setOpen(true)}} onMouseOut={()=>{setOpen(false)}} style={{ minWidth: 320 }}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                    <div className="text-gray-600 mr-3">
                            {record.point ? (index + 1).toString().padStart(2, '0'):""}
                        </div>
                        <Avatar user={user} />
                        <div className="flex flex-col ml-3">
                            <div className='text-sm'>{user.fullname}</div>
                        </div>
                       {
                            record.point ?
                            <div className="flex flex-col ml-3">
                                <div className='text-sm'>{record.point}</div>
                            </div> :""
                       }
                    </div>
                </div>
               {
                   open && <div className="absolute shadow-lg rouned-md z-30 bg-white ml-4">
                       {
                            podcasts?.map((podcast)=>{
                                return <div key={podcast.id} className="flex text-sm ml-4">
                                    <div className="font-bold">{podcast.name}</div>
                                    <div className="ml-2 mb-1 text-green-500 mr-2">
                                        {record.data[podcast.id].is_submitted
                                            ?<div>Submitted {record.data[podcast.id].point}</div>
                                                :record.data[podcast.id].is_listening ?"Listening":""}
                                    </div>
                                </div>
                            })
                       }
                   </div>
               }

            </div>}
        </>
    )
};

interface ResponseType {
    user_record: RawRecordChallengeUser,
    podcast_challenges: RawPodcastChallenge[],
    podcasts: RawPodcast[],
    challenge: RawChallenge,
    code: number,
    message:string 
}

const mapPodcastChallenge = (podcast_challenges: RawPodcastChallenge[])=>{
    return podcast_challenges.reduce((pre,cur)=>{
        return {...pre,[cur.podcast_id]: cur}
    },{}) as {[key:number]: RawPodcastChallenge};
}

const mapPodcastPoint = (limit_podcast:{status:boolean, podcasts:{id:number,point:number}[]})=>{
    if(limit_podcast.status){
        return limit_podcast.podcasts.reduce((pre,cur)=>{
            return {...pre,[cur.id]:cur.point};
        },{}) as  {[key:number]: number};
    }
    return {} as {[key:number]: number};
}
const Detail = ()=>{
    const [user_record, setUserRecord] = useState<RawRecordChallengeUser>();
    const [page ,setPage] = useState(1);
    const [podcasts, setPodcasts] = useState<RawPodcast[]>([]);
    //new
    const [challenge,setChallenge] = useState<RawChallenge>();
    const {id} = useParams();

    useEffect(()=>{
        (async()=>{
           try {
                const res = await Fetch.postWithAccessToken<ResponseType>("/api/challenge/detail", {id:id,page:page});
                console.log(res.data);
                if(res.status == 200 && res.data.code == Code.SUCCESS){
                    const {podcast_challenges,challenge, podcasts,user_record} = res.data;
                    const map_podcast_challenge = mapPodcastChallenge(podcast_challenges);
                    const map_podcast_point = mapPodcastPoint(challenge.challenge_type.limit_podcast);
                    for(const podcast of podcasts)
                        {
                            podcast.podcast_challenge = map_podcast_challenge[podcast.id];
                            podcast.point = map_podcast_point[podcast.id];
                            podcast.state = user_record.data[podcast.id];
                        }
                    setChallenge(challenge);
                    setPodcasts(podcasts);
                    setUserRecord(user_record);
                }
           } catch (error) {
               Toast.error("Error..");
           }
        })();
     },[]);
    
    const state = useAsync(async()=>{
        const res = await Fetch.postWithAccessToken<{records:RawRecordChallengeUser[], member_num:number,rank:number,code:number,message:string}>("/api/record.challenge.user/user_list", {id:id,page:page});
        if(res.status == 200){
            if(res.data && res.data.code == Code.SUCCESS){
                console.log(res.data);
                return {
                    records: res.data.records,
                    member_num: res.data.member_num,
                    rank: res.data.rank
                }
            }
        }
        return {
            records: [],
            member_num: 0,
            rank: 0
        }
    },[page,user_record]);

    UserHook.useFetchUsers(state.value?state.value.records.map(e => e.user_id):[]);

    const joinChallenge =async (challenge_id:number)=>{
        const res = await Fetch.postWithAccessToken<{record:RawRecordChallengeUser ,code: number ,message: string}>("/api/challenge/join", {challenge_id:challenge_id});
        if (res && res.data) {
            if (res.data.code != Code.SUCCESS) {
                Toast.error(res.data.message)
                return;
            }
            else {
                console.log(res.data.record);
                setUserRecord(res.data.record)
                Toast.success("Join Challenge Successful!")
                return;
            }
        }
    }

    const unJoinChallenge =async (challenge_id:number)=>{
        const res: any = await Fetch.postWithAccessToken<{ code: number }>("/api/challenge/unjoin", {challenge_id:challenge_id});
        if (res && res.data) {
            if (res.data.code != Code.SUCCESS) {
                Toast.error(res.data.message)
                return;
            }
            else {  
                setUserRecord(undefined);
                Toast.success("Unjoin Challenge Successful!")
                return;
            }
        }
    }
    return (
        <>
        {challenge?(
        <div className="flex">
              <ChallengeContent challenge={challenge} podcasts={podcasts}/>
              <div className="flex mt-20 ml-8 ">
                  <div className="fixed h-66 shadow-lg rounded-lg w-80 flex flex-col items-center">
                      <div className="flex flex-col items-center">
                          <div className="mb-1 text-white">Challenge</div>
                          {
                            challenge.start_time > Helper.time() ?( (user_record && user_record.id)?
                              <div className="flex ">
                                   <div className="text-green-500  font-medium text-2xl">Đã tham gia</div>
                                   {
                                      <div onClick={()=>unJoinChallenge(challenge.id)}className="ml-2 outline-none cursor-pointer w-24  focus:outline-none bg-red-500 text-white flex items-center justify-center py-1 rounded font-medium  shadow hover:bg-red-600 transition-all block">Bỏ cuộc</div>
                                   }
                              </div>
                              :
                              <button onClick={()=>joinChallenge(challenge.id)} className=" outline-none w-36  focus:outline-none bg-green-500 text-white flex items-center justify-center py-1 rounded font-medium  shadow hover:bg-green-600 transition-all block">Tham gia ngay</button>
                             ):""
                        }
                      </div>
                      <div className="flex mt-3 pb-2">
                          <BiTime className="w-4 h-4 ml-2 mt-1"/>
                          <div className="ml-2">Từ {Helper.getExactDay(challenge.start_time)}</div>
                          <div className="ml-2">đến {Helper.getExactDay(challenge.end_time)}</div>
                      </div>
                  </div>
                  <div className="fixed mt-32 max-h-96 w-80 shadow-lg rounded-lg pb-4">
                  {
                      challenge.start_time> Helper.time()
                      ?<div className="ml-4 mt-2 mb-2"><span className="text-lg text-yellow-600 font-bold">{state.value?state.value.member_num:0}</span> người đã tham gia</div>
                      :<div className="ml-4 mt-1 text-1xl font-bold">Top user</div>
                  }
                   <div className=" h-64 pb-4">
                        {
                            state.value && user_record && Helper.time() >= challenge.start_time?
                            <div className="bg-green-200">
                                <UserItem record={user_record} index={state.value.rank} podcasts={podcasts}/>
                            </div>
                            :""
                        }
                        {
                            state.value? state.value.records.map((item,index)=>{
                                return <UserItem key ={item.id} record={item} index={index} podcasts={podcasts}/>
                            }):""
                        }
                   </div>
                    <div className="flex ml-2  justify-center items-center">
                        <BsArrowLeftCircle onClick={()=>{if(page>1)setPage(page-1)}} className="w-6 h-6 cursor-pointer"/>
                        <div className="flex ml-2 mb-1 text-xl ">{page}</div>
                        <BsArrowRightCircle onClick={()=>{if(page*5 < (state.value? state.value.member_num:0)) setPage(page+1)}} className="w-6 h-6 ml-2 cursor-pointer"/>
                    </div>
                </div>
              </div>
        </div>):""}
    </>
      );
}
const PodcastItem = ({podcast}:{podcast:RawPodcast})=>{
    const {podcast_challenge} = podcast; 
	return (
	<div className="w-full w-4/5 mb-10 md:mb-6">
		<Link to={`/podcasts/detail/${Helper.generateCode(podcast.name)}/${podcast.id}`}>
			<a className="md:w-11/12 w-full flex justify-between items-center md:items-stretch box-border px-3  py-2 hover:shadow-lg rounded-lg transition-all">
				<div className="flex">
                    <div
                        style={{
                            backgroundImage: `url(${Constants.IMAGE_URL + podcast.image_url})`
                        }}
                        className="bg-center flex-shrink-0 bg-cover bg-no-repeat w-24 h-24 sm:w-28 sm:h-28 md:w-20  md:h-20 2xl:w-24 2xl:h-24 rounded-lg">

                    </div>
                    <div className="pl-3  md:pl-2 flex flex-col justify-between cursor-pointer">
                        <div className="">
                            <h4 className="mb-0.5 mt-0 text-xs font-bold">ESL {podcast.sub_name}</h4>
                            <p className="text-base text-gray-500 leading-5 line-clamp-2">
                                {podcast.name}
                            </p>
                            {
                                podcast_challenge &&
                                <div>
                                    <div>Complete : {Math.min(100*(podcast_challenge.metatype=="hint"? podcast_challenge.ans_hint/podcast.hint_size :(podcast_challenge.ans_without_hint/podcast.result_size)),100).toFixed(2)}%</div>
                                    <div className="flex items-center text-blue-600"><MdIncompleteCircle/>{podcast_challenge.point}</div>
                                </div>

                            }
                        
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end text-sm text-green-600 ">
                    {
                        podcast.state?.is_submitted ?<div>Submitted</div>
                            :podcast.state?.is_listening?<div>Listening</div>:""
                    }
                    <div className="flex items-center "><GrScorecard /> <div>{podcast.point}</div></div>
                </div>
			</a>
		</Link>
	</div>);
}

const CountDown =({time_init}:{time_init:number})=>{
    const [time,setTime] = useState(time_init);
    useEffect(()=>{
      const interval =  setInterval(()=>{setTime(time-1)},1000);
      return ()=>{
          clearInterval(interval);
      }
    },[time]);
    return (
        <div>
            {Helper.getTime(time)}
        </div>
    )
}

const ChallengeContent = ({challenge ,podcasts}:{challenge:RawChallenge, podcasts:RawPodcast[]})=>{
    const {challenge_type}= challenge;
    return (
        <div className="ml-20 md:w-7/12">
            <div className="mt-20 shadow-lg ">
                <div className=" ">
                    {/* <img className="h-64 w-full rounded-lg" src="https://th.bing.com/th/id/R.33d02c67b4a6e90abe2d7a58f764edd8?rik=gA%2fesQP2%2f0%2b5uw&riu=http%3a%2f%2fwww.snut.fr%2fwp-content%2fuploads%2f2015%2f12%2fimage-de-nature-9.jpg&ehk=4oiNLekZZh50XowVszovQmq8w%2fH0S6GIwQYqeKknWaM%3d&risl=&pid=ImgRaw&r=0" alt="" /> */}
                    <img className="h-64 w-full rounded-lg" src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
                </div>
                {
                    challenge.start_time >= Helper.time()
                        ?(
                            <div className="flex justify-center font-mono font-bold  my-1 mb-2 pb-2">
                            <div className="mr-2" >Hạn đăng ký:</div>
                            <CountDown time_init={challenge.start_time - Helper.time()}/>
                            </div>
                        ):
                    challenge.end_time >= Helper.time()
                        ?(
                            <div className="flex justify-center font-mono font-bold  my-1 mb-2 pb-2">
                            <div className="mr-2" >Thời gian còn lại:</div>
                            <CountDown time_init={challenge.end_time - Helper.time()}/>
                            </div>
                        ):""
                }
            </div>
            <div className="mt-3 shadow-lg mb-8 pb-4">
               <div className="ml-5">
                <div className="mt-4 pt-2 ml-2 font-bold text-xl ">{challenge.name}</div>
                    <div>
                        <div className="ml-2 mt-2 font-bold text-lg">Mục đích</div>
                        <div className="ml-2">
                            {ReactHtmlParser(challenge.description)}
                        </div>
                    </div>
                    <div className="pb-3">
                        <div className="ml-2 mt-2 font-bold text-lg">Hình thức</div>
                            <div className="ml-2">
                            {
                                challenge_type.team.status?(
                                    <div><GiArcheryTarget className="inline"/> Theo team {challenge_type.team.number_member} người</div>
                                ):""
                            }
                            {
                                challenge_type.limit_time.status?(
                                    <div><GiArcheryTarget className="inline"/> Bạn sẽ phải nghe ít nhất {challenge_type.limit_time.time} </div>
                                ):""
                            }
                            {
                                challenge_type.limit_podcast.status?(
                                    <div><GiArcheryTarget className="inline"/> Bạn sẽ phải nghe {challenge_type.limit_podcast.podcasts.length} podcast trong thời gian challenge </div>
                                ):""
                            }
                            {
                                !challenge_type.team.status && !challenge_type.limit_time.status
                                && !challenge_type.limit_podcast.status?(
                                    <div><GiArcheryTarget className="inline"/> Bạn sẽ phải nghe nhiều nhất có thể!!</div>
                                ):""
                            }
                        </div>
                    </div>
                   {
                       challenge.start_time > Helper.time() ? <div className="font-bold mt-2 ml-2">
                                <div>Chúc bạn tham gia challenge vui vẻ và bổ ích !!</div>
                            </div>:
                        podcasts.map((item)=> <PodcastItem podcast={item}/>)
                   }
               </div>
            </div>
        </div>
    )
}
// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJsonWithAccessToken<any>('/api/challenge/detail', {
//         id: context.params ? (context.params)['id'] : 0,
//         access_token: Helper.getCookieFromReq("access_token", context.req.headers.cookie ? context.req.headers.cookie.toString() : "")
//     })
//     console.log(res.data);
//     return {
//         props: { 
//             challenge: res.data.challenge ,
//             record_init:res.data.records,
//             member_num:res.data.member_num,
//             checked: res.data.checked
//         }
//     }
// }
export default Detail;