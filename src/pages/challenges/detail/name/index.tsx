import { GetServerSideProps } from "next";
import {useState ,useEffect, useRef, useMemo} from "react";
import Constants, { Code } from '../../../../Constants';
import {  RawChallenge, RawPodcast, RawPodcastChallenge, RawPodcastSubmit, RawRecordChallengeUser, RawTeamChallenge, RawUser } from "../../../../store/types";
import Fetch from "../../../../services/Fetch";
import { UserHook } from "../../../../store/user/hooks";
import { Helper } from '../../../../services/Helper';
import {BiCaretDownCircle, BiCaretUpCircle, BiDetail, BiTime} from "react-icons/bi";
import {BsArrowLeftCircle ,BsArrowRightCircle, BsChatSquareQuote} from "react-icons/bs";
import { Toast } from '../../../../services/Toast';
import { useAsync } from 'react-use';
//@ts-ignore
import ReactHtmlParser from 'react-html-parser';
import { Link, useParams } from "react-router-dom";
import { GiArcheryTarget } from "react-icons/gi";
import { AiFillEdit, AiOutlineCalendar, AiOutlineClockCircle, AiOutlineCopy, AiOutlineLoading3Quarters, AiOutlineSearch } from "react-icons/ai";
import { IoMdTrash } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { RiDeleteBin2Fill, RiTeamFill } from "react-icons/ri";
import { MeHook } from "../../../../store/me/hooks";
import Modal from "react-responsive-modal";
import TeamForm from "../../../../page.components/challenges/TeamForm";
import AvatarTeam from "../../../../components/ui/AvatarTeam";
import ListUser from "../../../../page.components/challenges/ListUser";
import { FiLogOut, FiUsers } from "react-icons/fi";
import { MdPublic, MdPublicOff, MdPublish } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { ChallengeHook } from "../../../../store/challenge/hooks";
import OutsideClickDetect from "../../../../components/ui/OutsideClickDetection";
import { HiDotsVertical } from "react-icons/hi";
import { CgDetailsMore } from "react-icons/cg";
import { TiEquals } from "react-icons/ti";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UI from "../../../../services/UI";
import LeaderBoard from "../../../../components/leader.board/LeaderBoard";
import LeaderBoardItem from "../../../../components/leader.board/LeaderBoardItem";
import Avatar from "../../../../components/leader.board/Avatar";
import { LeaderBoardItemProps, ListTeamResponse, ListUserResponse, PerformanceProps, PodcastChallengeListen, TeamResponse, UserRecordResponse } from "../../../../store/interface";
import Performance from "../../../../page.components/challenges/Performance";
import ListPodcast from "../../../../page.components/challenges/ListPodcast";
import TeamRecord from "../../../../page.components/challenges/TeamRecord";
import CountDown from "../../../../page.components/challenges/CountDown";
import SearchUser from "../../../../page.components/challenges/SearchUser";
import SearchTeam from "../../../../page.components/challenges/SearchTeam";

//------- Response------------//

interface ResponseType {
    user_record: RawRecordChallengeUser,
    podcast_challenges: RawPodcastChallenge[],
    podcast_submits: RawPodcastSubmit[],
    podcasts: RawPodcast[],
    challenge: RawChallenge,
    user_team: RawTeamChallenge,
    member_number: number,
    team_number: number,
    users: RawUser[],
    rank:number,
    members : RawUser[],
    code: number,
    message:string 
}


interface UserTeamProps {
    team: RawTeamChallenge,
    performance: PerformanceProps,
    is_time_register: boolean,
    is_leave: boolean,
    max_member: number,
    reloadData: () => void,
    closeModalTeam: ()=>void
}


//------------Leader_Board----------------//
const Replacement = () => {
    return (
        <div className="rounded-md max-w-sm w-full mx-auto hover:shadow">
            <div className="animate-pulse flex space-x-4 px-2 py-2">
                <div className="rounded-full bg-gray-400 h-8 w-8"></div>
                <div className="flex-1 space-y-6 py-1">
                    <div className="h-6 bg-gray-300 rounded"></div>
                </div>
            </div>
        </div>
    );
}



const UserTeamRecord = ({ team, is_time_register,is_leave, max_member, performance, reloadData,closeModalTeam }: UserTeamProps) => {
    const [open, setOpen] = useState(false);
    const [is_invite, setIsInvite] = useState(false);

    return (
        <div className="ml-5">
            <div className='w-full py-1'>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                        <Avatar name={team.name} link={""} img={team.avatar} size={36} />
                        <div className="flex flex-col ml-2">
                            <div className='text-base font-medium text-gray-800'>{team.name}</div>
                        </div>
                        <div onClick={() => { setOpen(true) }} className="text-gray-800 ml-3 cursor-pointer hover:text-black">
                            <BiDetail className="w-5 h-full" />
                        </div>
                    </div>
                </div>
                {!is_time_register && <div className="border-black-200 mt-3" style={{ borderBottomWidth: 1 }}></div>}
            </div>
            {
                is_time_register && (
                    <div className="flex ml-2">
                        <div className="flex text-black">
                            <div ><FiUsers className="w-4 h-full" /></div>
                            <div className="ml-1 text-base">{team.user_ids.length}/{max_member}</div>
                        </div>
                        <button onClick={() => { setIsInvite(true) }} className="text-white px-2 py-1 rounded-lg font-medium ml-4 hover:bg-green-500" style={{ backgroundColor: "#2A6A02" }}>
                            Send invite
                        </button>
                    </div>
                )
            }
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5"
                }}
                onClose={() => setIsInvite(false)} open={is_invite}>
                <>
                    {is_invite && (
                        <div>
                            <ListUser team={team} />
                        </div>
                    )}
                </>
            </Modal>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12 "
                }}
                onClose={() => setOpen(false)} open={open}>
                <>
                    {open && (
                        <TeamRecord team_id={team.id} is_time_register={is_time_register} is_leave={is_leave} reloadData={reloadData} closeModal={closeModalTeam} />
                    )}
                </>
            </Modal>
        </div>
    )
};


//----------------------------------------------//

const UserRecord = ({ performance, podcast_listened, podcast_unlisten, is_join }: { performance: PerformanceProps, podcast_listened: PodcastChallengeListen[], podcast_unlisten: PodcastChallengeListen[], is_join: boolean }) => {
    return (
        <div className='ml-5 w-full'>
            {is_join && <div style={{ minWidth: 500 }}>
                <Performance {...performance} />
                <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
            </div>}
            {
                podcast_listened.length ? (
                    <ListPodcast podcast_listens={podcast_listened} title={"Podcast listened"} />
                ) : ""
            }
            {
                podcast_unlisten.length ? (
                    <ListPodcast podcast_listens={podcast_unlisten} title={"Podcast unlisten"} />
                ) : ""
            }
        </div>
    )
}

const MemberRecord = ({ user_record_id }: { user_record_id: number }) => {
    const me = MeHook.useMe();
    const user_record_state = useAsync(async () => {
        try {
            const res = await Fetch.postWithAccessToken<UserRecordResponse>('/api/record.challenge.user/user.detail', {
                user_record_id: user_record_id,
            });

            if (res && res.data && res.data.code == Code.SUCCESS) {
                const { user_record, podcast_challenges, member_number, rank, user, podcasts } = res.data;
                const mapping = Helper.mapPodcastChallengeByPodcastId(podcast_challenges);

                const podcast_listened = [] as PodcastChallengeListen[];
                const podcast_unlisten = [] as PodcastChallengeListen[];

                for (const podcast of podcasts) {
                    if (mapping[podcast.id]) {
                        podcast_listened.push({
                            podcast_challenge: mapping[podcast.id],
                            podcast: podcast
                        })
                    } else {
                        podcast_unlisten.push({
                            podcast: podcast
                        })
                    }
                }

                let performance = {} as PerformanceProps;
                let is_join = false;

                if (user_record) {
                    performance = {
                        time_listen: user_record.time_listen,
                        point: user_record.point,
                        member_number: member_number,
                        title: (me && me.id == user_record.user_id) ? "Your performance" : `${user.fullname}'s performance`,
                        rank: rank
                    };
                    is_join = true;
                }

                return {
                    is_join: is_join,
                    performance: performance,
                    podcast_unlisten: podcast_unlisten,
                    podcast_listened: podcast_listened
                }
            }

        } catch (error) {
            console.log(error);
            Toast.error("ERROR!!");
        }
        return {
            is_join: false,
            performance: {} as PerformanceProps,
            podcast_listened: [],
            podcast_unlisten: []
        }
    }, []);
    return (
        <div className="mr-4 mt-2">
            {
                user_record_state.loading && <div>...Loading</div>
            }
            {
                user_record_state.value && <UserRecord {...user_record_state.value} />
            }
        </div>
    )
}

const EnterTeam = ({ challenge_id, reloadData }: { challenge_id: number, reloadData: () => void }) => {
    const TEAM_INIT = {
        id: 0,
        name: "",
        avatar: "",
        metatype: "",
        description: "",
        user_id: 0,
        challenge_id: challenge_id,
        data: "",
        create_at: 1,
        last_update: 1,
        status: 1,
        user_ids: [],
        hash_key: "",
        point: 1,
        time_listen: 1,
        user_invited_ids: [],
        user_requested_ids: [],
        admin_ids: [],
        rank_record: {
            last_update: 0,
            rank: 0,
            status: 0
        },
    } as RawTeamChallenge;

    const [code, setCode] = useState("");
    const handleEnterCode = async () => {
        try {
            const res = await Fetch.postWithAccessToken<{ user_record: RawRecordChallengeUser, message: string, code: number }>("/api/team.challenge/join", {
                code: code
            });
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                else {
                    reloadData();
                    Toast.success("Join Challenge Successful!")
                    return;
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Please login to join the challenge!");
        }
    }
    return (
        <div className="flex justify-center mt-5">
            <div className="w-2/5 mr-6">
                <TeamForm team={TEAM_INIT} reloadData={reloadData} />
            </div>
            <div className="flex flex-col items-center">
                <div className="text-gray-500 text-lg">OR</div>
                <div className="border-black-200 h-full" style={{ borderRightWidth: 1 }}></div>
            </div>
            <div className="ml-6 w-2/5 -mr-2">
                <div className="flex">
                    <input className="border-gray-300 mr-2 h-8 w-full" type="text" value={code} onChange={(e) => { setCode(e.target.value) }} placeholder=" Enter code here..." style={{ borderWidth: 1 }} />
                    <button onClick={handleEnterCode} className="outline-none w-16 focus:outline-none bg-green-500 text-white flex mb-6 items-center justify-center py-1 px-1 rounded font-medium  shadow hover:bg-primary-dark transition-all">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    )
}

const Detail = ()=>{
    const [page ,setPage] = useState(1);
    const [challenge,setChallenge] = useState<RawChallenge>();
    const [member_number, setMemberNumber] = useState(0);
    const [team_number, setTeamNumber] = useState(0);
    ///////----------------Copy----------------//
    const [reload, setReload] = useState(false);
    const {id} = useParams();
    const [user_id_selected, setUserIdSelected] = useState(0);
    const [team_id_selected, setTeamIdSelected] = useState(0);
    const [open_detail_user,setOpenDetailUser] = useState(false);
    const [open_detail_team,setOpenDetailTeam] = useState(false);
    const [open_enter_team,setOpenEnterTeam] = useState(false);
    const [open_view,setOpenView] = useState(false);
    const [is_loading,setIsLoading] = useState(false);

    const me = MeHook.useMe();

    const handleView = ()=>{
        setOpenView(!open_view)
    }
    const reloadData = ()=>{
        setReload(!reload);
        if(open_enter_team)setOpenEnterTeam(false);
    }

    const closeModalTeam = ()=>{
        setOpenDetailTeam(false);
        setTeamIdSelected(0);
    }

    useEffect(()=>{
        if(user_id_selected){
            setOpenDetailUser(true);
        }
    },[user_id_selected])

    useEffect(()=>{
        if(team_id_selected){
            setOpenDetailTeam(true);
        }
    },[team_id_selected])

    const handleLeaveChallenge =async()=>{
        try {
            setIsLoading(true);
            const res = await Fetch.postWithAccessToken<{user_record: RawRecordChallengeUser,code: number, message: string}>("/api/challenges/leave",
                {id: challenge ? challenge.id: 0}
            );
            if (res && res.data) {
                if (res.data.code == Code.SUCCESS) {
                    setReload(!reload);
                    Toast.success("Leave Challenge Successful!")
                }
                else {
                    Toast.error(res.data.message)
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
        setIsLoading(false);
    }

    const handleJoinChallenge = async()=>{
        if(challenge){
            if(challenge.challenge_type.team.status){
                setOpenEnterTeam(true);
            }else{
                try {
                    setIsLoading(true);
                    const res = await Fetch.postWithAccessToken<{user_record: RawRecordChallengeUser, message: string, code: number}>("/api/challenges/join",
                        {id: challenge.id}
                    );
                    console.log("Join Challenge",res.data);
                    if (res && res.data) {
                        if (res.data.code == Code.SUCCESS) {
                            setReload(!reload);
                            Toast.success("Join Challenge Successful!")
                        }
                        else {
                            Toast.error(res.data.message)
                        }
                    }
                } catch (error) {
                    console.log(error);
                    Toast.error("Please login to join the challenge!");
                }
                setIsLoading(false);
            }
        }
    }

    useEffect(()=>{
        (async()=>{
           try {
                const res = await Fetch.postWithAccessToken<ResponseType>("/api/challenges/detail", {id:id,page:page});
                if(res.status == 200 && res.data.code == Code.SUCCESS){
                    const { challenge,
                            podcasts,
                            member_number,
                            team_number
                        } = res.data;
                    setMemberNumber(member_number);
                    setTeamNumber(team_number);
                    setChallenge(challenge);
                }
           } catch (error) {
               console.log(error);
               Toast.error("Error!!");
           }
        })();
     },[]);
    
    
     const leader_board_user_state = useAsync(async () => {

        if (challenge) {
            try {
                const res = await Fetch.post<ListUserResponse>('/api/record.challenge.user/user.list', {
                    challenge_id: challenge.id,
                    page: page
                });

                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { users, record_challenge_users, member_number } = res.data;
                    record_challenge_users.sort((a, b) => b.point - a.point);
                    const items = [] as LeaderBoardItemProps[];
                    const map_point = Helper.mapPointToRank(record_challenge_users.map(e => e.point));
                    const map_user = Helper.mapUserById(users);
                    const is_pos = challenge.start_time < Helper.time();

                    for (const record of record_challenge_users) {
                        const rank = map_point[record.point];
                        const user = map_user[record.user_id];
                        items.push({
                            id: record.id,
                            rank: rank,
                            rank_status: Helper.getRankStatus(rank, record.rank_record),
                            is_pos: is_pos,
                            avatar: {
                                name: user.fullname,
                                img: user.avatar,
                                link: `/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`,
                                sub_name: user.username,
                            },
                            extensions: is_pos ? [{ info: (record.point / 100).toFixed(2).toString() }] : []
                        })
                    }

                    return {
                        items: items,
                        item_number: member_number
                    }
                }
            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            items: [],
            item_number: 0
        }
    }, [reload, page, challenge]);



    const leader_board_team_state = useAsync(async () => {
        if (challenge) {
            try {
                const res = await Fetch.post<ListTeamResponse>('/api/team.challenge/list', {
                    challenge_id: challenge.id,
                    page: page
                });
                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { teams, team_number } = res.data;
                    const max_member = challenge.challenge_type.team.number_member;
                    const map_point = Helper.mapPointToRank(teams.map(e => e.point));
                    const team_items = [] as LeaderBoardItemProps[];
                    const is_pos = challenge.start_time < Helper.time();

                    for (const team of teams) {
                        const rank = map_point[team.point];
                        team_items.push({
                            id: team.id,
                            rank: rank,
                            rank_status: Helper.getRankStatus(rank, team.rank_record),
                            is_pos: is_pos,
                            avatar: {
                                name: team.name,
                                img: team.avatar,
                                link: "",
                            },
                            extensions: is_pos ? [{ info: (team.point / 100).toFixed(2).toString() }]
                                : [{ info: team.user_ids.length + "/" + max_member, icon: <FiUsers /> },
                                { info: "", icon: (team.status == 1 ? <MdPublic /> : <MdPublicOff />) }]
                        })
                    }

                    return {
                        items: team_items,
                        item_number: team_number
                    }
                }

            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            items: [],
            item_number: 0
        }
    }, [reload, challenge, page]);

    const user_record_state = useAsync(async () => {
        if (challenge) {
            try {
                const res = await Fetch.postWithAccessToken<UserRecordResponse>('/api/record.challenge.user/user.detail', {
                    challenge_id: challenge.id,
                });

                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { user_record, podcast_challenges, member_number, rank, podcasts } = res.data;
                    const mapping = Helper.mapPodcastChallengeByPodcastId(podcast_challenges);
                    const podcast_listened = [] as PodcastChallengeListen[];
                    const podcast_unlisten = [] as PodcastChallengeListen[];

                    for (const podcast of podcasts) {
                        if (mapping[podcast.id]) {
                            podcast_listened.push({
                                podcast_challenge: mapping[podcast.id],
                                podcast: podcast
                            })
                        } else {
                            podcast_unlisten.push({
                                podcast: podcast
                            })
                        }
                    }

                    let performance = {} as PerformanceProps;
                    let is_join = false;

                    if (user_record && user_record.id) {
                        performance = {
                            time_listen: user_record.time_listen,
                            point: user_record.point,
                            member_number: member_number,
                            title: "Your performance",
                            rank: rank
                        };
                        is_join = true;
                    }

                    return {
                        is_join: is_join,
                        performance: performance,
                        podcast_unlisten: podcast_unlisten,
                        podcast_listened: podcast_listened
                    }
                }
                Toast.error(res.data.message);
            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            is_join: false,
            performance: {} as PerformanceProps,
            podcast_listened: [],
            podcast_unlisten: []
        }
    }, [me, challenge, reload]);

    const team_record_state = useAsync(async () => {
        if (me && challenge) {
            try {
                const res = await Fetch.postWithAccessToken<TeamResponse>('/api/team.challenge/detail', {
                    challenge_id: challenge.id
                });

                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { team, users, record_challenge_users, rank, team_number } = res.data;
                    record_challenge_users.sort((a, b) => b.point - a.point);

                    const map_point = Helper.mapPointToRank(record_challenge_users.map(e => e.point));
                    const members = [] as LeaderBoardItemProps[];
                    const map_user = Helper.mapUserById(users);

                    const is_pos = challenge.start_time < Helper.time();
                    let member_rank = 0;
                    for (const record of record_challenge_users) {
                        const user = map_user[record.user_id];
                        const rank_record = record.rank_record;
                        member_rank = map_point[record.point];
                        members.push({
                            id: user.id,
                            rank: member_rank,
                            rank_status: Helper.getRankStatus(member_rank, rank_record),
                            is_pos: is_pos,
                            avatar: {
                                name: user.fullname,
                                img: user.avatar,
                                link: `/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`,
                                sub_name: user.username,
                            },
                            extensions: is_pos ? [{ info: (record.point / 100).toFixed(2).toString() }] : []
                        })
                    }

                    let performance = {} as PerformanceProps;

                    if (team && team.id) {
                        performance = {
                            time_listen: team.time_listen,
                            point: team.point,
                            member_number: team_number,
                            title: "Your team performance",
                            rank: rank
                        }
                    }
                    return {
                        max_member: challenge.challenge_type.team.number_member,
                        performance: performance,
                        members: members,
                        team_number: team_number,
                        team: team,
                    }
                }

            } catch (error) {
                console.log(error);
                Toast.error("ERROR!!");
            }
        }
        return {
            max_member: 0,
            performance: {} as PerformanceProps,
            members: [],
            team_number: 0,
            team: {} as RawTeamChallenge,
        }
    }, [me, reload, challenge]);

    return (
        <>
            (
            { challenge && 
            <div className="w-full overflow-hidden">
                <div className="bg-center flex-shrink-0 bg-contain bg-no-repeat overflow-hidden mt-7">
                    <img className="w-full h-64 object-cover " src={`${Constants.IMAGE_URL + challenge.background_image}`} alt="" />
                </div>
                <div className="font-semibold text-5xl mt-10 w-full text-center">
                    {challenge.name}
                </div>
                <div className="flex justify-between mt-10 ml-20 items-start">
                    <div className="flex w-2/3 justify-between flex-wrap mt-5 ml-5 items-start">
                        <div className="flex flex-col">
                            <div className='flex items-center mb-9'>
                                <div><AiOutlineClockCircle className="w-10 h-full" /></div>
                                <div className='text-base ml-4 text-gray-800 w-full'>
                                    <CountDown start_time={challenge.start_time} end_time={challenge.end_time} reloadData={reloadData} />
                                </div>
                            </div>
                            <div className='flex items-center mb-9'>
                                <div><FaUser className="w-10 h-full" /></div>
                                {
                                    leader_board_user_state.value &&
                                    <div className='text-base text-gray-800 ml-4'>{leader_board_user_state.value.item_number} participants</div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col mr-20">
                            <div className='flex items-center mb-9'>
                                <div><AiOutlineCalendar className="w-10 h-full" /></div>
                                <div className='text-base text-gray-800 ml-4'>{Helper.getExactDay(challenge.start_time)} - {Helper.getExactDay(challenge.end_time)}</div>
                            </div>
                            {
                                challenge.challenge_type.team.status && (
                                    <div className='flex items-center mb-9'>
                                        <div><RiTeamFill className="w-10 h-full" /></div>
                                        {
                                            leader_board_team_state.value &&
                                            <div className='text-base text-gray-800 ml-4'>{leader_board_team_state.value.item_number} teams</div>
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className=" mt-5 mr-20">
                        {
                            user_record_state.loading ? <div className="w-full" style={{ width: 213 }}><Replacement /></div> : (
                                <>
                                    {
                                        user_record_state.value && user_record_state.value.is_join ? (
                                            <div className="flex flex-col">
                                                {(challenge.challenge_type.team.status && challenge.end_time > Helper.time()) && (
                                                    <div className='cursor-default text-white rounded-full font-medium  py-4 px-2' style={{ borderWidth: 1, borderColor: "#2A6A02", width: 213, fontSize: 12 }}>
                                                        {
                                                            team_record_state.value && team_record_state.value.team.id && (
                                                                <UserTeamRecord {...team_record_state.value} is_time_register={true} reloadData={reloadData} is_leave={challenge.start_time > Helper.time()} closeModalTeam={closeModalTeam}/>
                                                            )
                                                        }
                                                    </div>)}

                                                {!challenge.challenge_type.team.status && (
                                                    <>
                                                        <button className='cursor-default text-white rounded-full font-medium py-3 px-2' style={{ borderWidth: 1, backgroundColor: "#2A6A02", width: 213, fontSize: 12 }}>
                                                            JOINED
                                                        </button>
                                                        {challenge.start_time > Helper.time() && (
                                                            <button onClick={handleLeaveChallenge} className="cursor-pointer items-center flex justify-center border-red-500 rounded-full font-medium  py-3 mt-4 hover:border-red-800" style={{ borderWidth: 1, width: 213, fontSize: 12 }}>
                                                                {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                                                <span> LEAVE CHALLENGE</span>
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        ) : (<div className="w-full ml-20">
                                            {challenge.end_time > Helper.time() && (
                                                <div className="flex flex-col">
                                                    <button onClick={handleJoinChallenge} className="cursor-pointer items-center flex justify-center bg-red-400 hover:bg-red-500 text-white rounded-full font-medium py-3 px-2" style={{ width: 213, fontSize: 12 }}>
                                                        {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                                        <span >Join Challenge</span>
                                                    </button>
                                                    <button className='border-red-400 rounded-full  font-medium py-3 mt-4' style={{ borderColor: "#2A6A02", width: 213, fontSize: 12 , borderWidth: 1}}>
                                                        SHARE TO FRIENDS
                                                    </button>
                                                </div>)
                                            }
                                        </div>)}
                                </>
                            ) }
                    </div>
                </div>
                <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
                <div className="ml-20">
                    <div className="flex flex-col ml-5 w-1/2 mt-4 text-gray-800">
                        {
                            challenge.challenge_type.team.status && (
                                <div className='flex items-center mb-5'>
                                    <div><GiArcheryTarget className="w-8 h-full" /></div>
                                    <div className="ml-4">Team {challenge.challenge_type.team.number_member} members</div>
                                </div>
                            )
                        }
                        {
                            challenge.challenge_type.limit_time.status ? (
                                <div className='flex items-center mb-5'>
                                    <div><GiArcheryTarget className="w-8 h-full" /></div>
                                    <div className="ml-4">Limit {challenge.challenge_type.limit_time.value} time</div>
                                </div>
                            )
                                : (
                                    <div className='flex items-center mb-5'>
                                        <div><GiArcheryTarget className="w-8 h-full" /></div>
                                        <div className="ml-4">Unlimit time listen</div>
                                    </div>
                                )
                        }
                        {
                            challenge.challenge_type.limit_podcast.status ? (
                                <div className='flex items-center mb-5'>
                                    <div><GiArcheryTarget className="w-8 h-full" /></div>
                                    <div className="ml-4">Limit {challenge.challenge_type.limit_podcast.podcasts.length} podcasts</div>
                                </div>
                            )
                                : (
                                    <div className='flex items-center mb-5'>
                                        <div><GiArcheryTarget className="w-8 h-full" /></div>
                                        <div className="ml-4">Unlimit podcast</div>
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
                {
                    challenge.start_time <= Helper.time() && (
                        <div className='mt-15'>
                            <div className="ml-20 flex mt-5 mb-6">
                                <div className="w-2/5">
                                    <div onClick={handleView} className='flex items-center ml-5 cursor-pointer hover:text-gray-900'>
                                        {open_view && <BiCaretDownCircle className='w-8 h-full' />}
                                        {!open_view && <BiCaretUpCircle className='w-8 h-full' />}
                                        <div className="font-medium text-xl ml-1 text-gray-800">Overview</div>
                                    </div>
                                    {
                                        open_view && (
                                            <div className="ml-5 text-gray-700 mt-2">
                                                {ReactHtmlParser(challenge.description)}
                                            </div>
                                        )
                                    }
                                </div>
                            </div>
                            <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
                        </div>
                    )
                }
                <div className="flex mt-10">
                    {
                        challenge.start_time > Helper.time()
                            ? (
                                <div className="flex mb-40  mr-8 ">
                                    <div className="flex">
                                        <div className="ml-20 mr-15" style={{ maxWidth: 450, minHeight: 400, minWidth: 320 }}>
                                            <div className="font-medium text-xl text-gray-800 ml-5">Overview</div>
                                            <div className="text-gray-500 mt-2 ml-5">
                                                {ReactHtmlParser(challenge.description)}
                                            </div>
                                        </div>
                                        <div className="border-black-200 ml-10" style={{ borderLeftWidth: 1 }}></div>
                                    </div>
                                </div>
                            ) : (
                                <div className="mb-40 ml-20 " style={{ borderRightWidth: 1 }} >
                                    {
                                        team_record_state.value && team_record_state.value.team &&
                                        team_record_state.value.team.id &&
                                        <div className=""><UserTeamRecord {...team_record_state.value} is_time_register={false} is_leave={challenge.start_time > Helper.time()} reloadData={reloadData} closeModalTeam={closeModalTeam} /></div>
                                    }
                                    {
                                        user_record_state.value &&
                                        <div className="flex w-full">
                                            <UserRecord {...user_record_state.value} />
                                        </div>
                                    }
                                </div>

                            )
                    }
                    <div className="mb-10 w-full">
                        {
                            challenge.challenge_type.team.status
                                ? leader_board_team_state.value && <LeaderBoard {...leader_board_team_state.value} page={page} setPage={setPage} handleData={setTeamIdSelected} searchComp={<SearchTeam challenge_id={challenge.id} handleData={setTeamIdSelected} />} />
                                : leader_board_user_state.value && <LeaderBoard {...leader_board_user_state.value} page={page} setPage={setPage} handleData={challenge.start_time > Helper.time() ? undefined : setUserIdSelected} searchComp={<SearchUser challenge_id={challenge.id} handleData={challenge.start_time > Helper.time() ? undefined : setUserIdSelected} />} />
                        }
                    </div>
                </div>
                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-11/12 xs:w-1/2"
                    }}
                    onClose={() => { setOpenDetailUser(false); setUserIdSelected(0) }} open={open_detail_user}>
                    <>
                        {open_detail_user && (
                            <MemberRecord user_record_id={user_id_selected} />
                        )}
                    </>
                </Modal>

                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-11/12 xs:w-1/2"
                    }}
                    onClose={() => setOpenEnterTeam(false)} open={open_enter_team}>
                    <>
                        {open_enter_team && (
                            <EnterTeam reloadData={reloadData} challenge_id={challenge.id} />
                        )}
                    </>
                </Modal>
                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-11/12"
                    }}
                    onClose={() => { setOpenDetailTeam(false); setTeamIdSelected(0) }} open={open_detail_team}>
                    <>
                        {open_detail_team && (
                            <TeamRecord team_id={team_id_selected} is_time_register={challenge.end_time > Helper.time()} is_leave={challenge.start_time > Helper.time()} reloadData={reloadData} closeModal={closeModalTeam} />
                        )}
                    </>
                </Modal>
            </div>
            }
        </>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const res = await Fetch.postJsonWithAccessToken<any>('/api/challenges/detail', {
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
