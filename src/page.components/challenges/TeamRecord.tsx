import { useMemo, useState } from "react";
import { AiFillEdit, AiOutlineCopy, AiOutlineLoading3Quarters } from "react-icons/ai";
import { CgDetailsLess } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { HiDotsVertical } from "react-icons/hi";
import { IoMdTrash } from "react-icons/io";
import { RiDeleteBin2Fill } from "react-icons/ri";
import Modal from "react-responsive-modal";
import { useAsync } from "react-use";
import Avatar from "../../components/leader.board/Avatar";
import LeaderBoard from "../../components/leader.board/LeaderBoard";
import LeaderBoardItem from "../../components/leader.board/LeaderBoardItem";
import OutsideClickDetect from "../../components/ui/OutsideClickDetection";
import { Code, TeamStatus } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Helper } from "../../services/Helper";
import { Toast } from "../../services/Toast";
import { LeaderBoardItemProps, PerformanceProps, PodcastChallengeListen, TeamResponse, UserRecordResponse } from "../../store/interface";
import { MeHook } from "../../store/me/hooks";
import { RawRecordChallengeUser, RawTeamChallenge, RawUser } from "../../store/types";
import Performance from "./Performance";
import TeamForm from "./TeamForm";

interface TeamRecordProps {
    team_id: number,
    is_leave: boolean, 
    is_time_register: boolean,
    reloadData: () => void,
    closeModal?: () => void,
}

const TeamRecord = ({ team_id, is_time_register,is_leave, reloadData, closeModal }: TeamRecordProps) => {
    const [reload, setReload] = useState(false);

    const reloadAll = () => {
        setReload(!reload);
        reloadData();
    }

    const team_record_state = useAsync(async () => {
        try {
            const res = await Fetch.postWithAccessToken<TeamResponse>('/api/team.challenge/detail', {
                team_id: team_id
            });

            if (res && res.data && res.data.code == Code.SUCCESS) {
                const { team, users, record_challenge_users, rank, team_number } = res.data;
                record_challenge_users.sort((a, b) => b.point - a.point);

                const map_point = Helper.mapPointToRank(record_challenge_users.map(e => e.point));
                const members = [] as LeaderBoardItemProps[];
                const map_user = Helper.mapUserById(users);

                let member_rank = 0;
                for (const record of record_challenge_users) {
                    const user = map_user[record.user_id];
                    const rank_record = record.rank_record;
                    member_rank = map_point[record.point];
                    members.push({
                        id: is_leave? user.id :record.id,
                        rank: member_rank,
                        rank_status: Helper.getRankStatus(member_rank, rank_record),
                        is_pos: !is_leave,
                        avatar: {
                            name: user.fullname,
                            img: user.avatar,
                            link: `/profile/${Helper.generateCode(user.username ? user.username : "")}/${user.id}`,
                            sub_name: user.username,
                        },
                        extensions: !is_leave ? [{ info: (record.point / 100).toFixed(2) }] : []
                    })
                }

                let performance = {} as PerformanceProps;

                if (team && team.id) {
                    performance = {
                        time_listen: team.time_listen,
                        point: team.point,
                        member_number: team_number,
                        title: "Team performance",
                        rank: rank
                    }
                }

                return {
                    performance: performance,
                    members: members,
                    team_number: team_number,
                    team: team,
                    rank: rank,
                }
            }

        } catch (error) {
            console.log(error);
            Toast.error("ERROR!!");
        }

        return {
            performance: {} as PerformanceProps,
            members: [],
            team_number: 0,
            team: {} as RawTeamChallenge,
            rank: 0,
        }
    }, [reload]);

    return (
        <>
            {
                team_record_state.loading ? (
                    <div>Loading...</div>
                ) : team_record_state && team_record_state.value && team_record_state.value.team && team_record_state.value.team.id && (
                    <div className=''>
                        <Header team={team_record_state.value.team} reloadAll={reloadAll} is_time_register={is_time_register} is_leave={is_leave} closeModal={closeModal}/>
                        {
                            is_leave 
                            ? <Register {...team_record_state.value} reloadAll={reloadAll}/> 
                            : <During {...team_record_state.value} />
                        }
                    </div>
                )
            }
        </>
    )
}

const Header = ({team,reloadAll,is_time_register,is_leave, closeModal}:{team:RawTeamChallenge, reloadAll:()=>void,is_time_register: boolean,is_leave: boolean, closeModal?:()=>void})=>{
    const me = MeHook.useMe();
    const [is_loading, setIsLoading] = useState(false);
    const is_admin = useMemo(() => {
        return me ? team.admin_ids.includes(me.id) : false;
    }, [me])

    const is_member = useMemo(() => {
        return me ? team.user_ids.includes(me.id) : false;
    }, [me]);

    const [is_request, setIsRequest] = useState(team.user_requested_ids.includes(me ? me.id : 0));

    const handleJoin = async () => {
        try {
            setIsLoading(true);
            const res: any = await Fetch.postWithAccessToken<{ team: RawTeamChallenge, code: number }>("/api/team.challenge/join",
                { code: team.hash_key, team_id: team.id }
            );
            if (res && res.data) {
                if (res.data.code == Code.SUCCESS) {
                    reloadAll();
                    Toast.success("Join Team Successful!")
                } else {
                    Toast.error(res.data.message);
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }

    const handleRequest = async () => {
        try {
            setIsLoading(true);
            const res: any = await Fetch.postWithAccessToken<{ code: number }>("/api/team.challenge/request",
                { team_id: team.id }
            );
            if (res && res.data) {
                if (res.data.code == Code.SUCCESS) {
                    setIsRequest(true);
                    Toast.success("Request Successful!")
                }else{
                    Toast.error(res.data.message)
                }
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }

    const handleCopy = (copyText: string) => {
        navigator.clipboard.writeText(copyText);
        Toast.success("Copied!")
    }

    return (
        <div className='ml-5 mt-2'>
            <div className='relative w-full py-1 rounded-md' style={{ minWidth: 480 }}>
                <div className="flex flex-row justify-between mr-5 items-center">
                    <div className="flex flex-row items-center">
                        <Avatar name={team.name} img={team.avatar} link={""} size={48} />
                        <div className="flex flex-col ml-2">
                            <div className='text-xl font-medium text-gray-800'>{team.name}</div>
                        </div>
                        <div>
                        {
                            team.status == TeamStatus.PUBLIC && !is_member && is_time_register && (
                                <a onClick={() => { handleJoin() }} className="cursor-pointer flex ml-2 bg-green-500 text-white py-1 px-3 rounded-lg font-medium mt-2 hover:bg-green-600 items-center">
                                    {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters/></span>}
                                    <span >Join</span>
                                </a>
                            )
                        }
                        {
                            team.status == TeamStatus.PRIVATE && !is_member && !is_request && is_time_register &&(
                                <div className="ml-4">
                                    <a onClick={() => { handleRequest() }} className="cursor-pointer flex bg-blue-500 text-white text-sm py-1 px-2 rounded-lg font-medium mt-2 hover:bg-blue-800 items-center">
                                        {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                        <span >Send Request</span>
                                    </a>
                                </div>
                            )
                        }
                        {
                            is_request && is_time_register && (
                                <div className="text-blue-500 ml-4 font-medium"> Requested</div>
                            )
                        }
                        </div>
                        <div className="ml-4">
                            {
                                is_member && (
                                    <SmallMenu team={team} is_admin={is_admin} reloadAll={reloadAll} is_time_register={is_time_register} is_leave={is_leave} closeModal={closeModal} />
                                )
                            }
                        </div>
                    </div>
                    <div className="">
                        {
                            team.status == TeamStatus.PUBLIC ? (<div className="text-green-500">Public</div>)
                                : team.status == TeamStatus.PRIVATE ? <span className="text-red-500">Private</span> : ""
                        }
                    </div>
                </div>
                <div className="mt-2 mb-2">{team.description}</div>
            </div>
            <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
            {
                team.hash_key && (
                    <div className="flex">
                        <span className="font-medium">Code:</span>
                        <div onClick={e => handleCopy(team.hash_key)} className="ml-2 hover:bg-gray-100 cursor-pointer flex items-center">
                            <div>{team.hash_key} </div>
                            <AiOutlineCopy />
                        </div>
                    </div>
                )
            }
            <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
        </div>
    )
}
const During = ({ members, team_number, performance }: {members: LeaderBoardItemProps[], team_number: number, performance: PerformanceProps }) => {
    const [selected_user_id, setSelectedUserId] = useState(members.length ? members[0].id : 0);

    const user_record_state = useAsync(async () => {
        if (selected_user_id) {
            try {
                const res = await Fetch.postWithAccessToken<UserRecordResponse>('/api/record.challenge.user/user.detail', {
                    user_record_id: selected_user_id
                });

                if (res && res.data && res.data.code == Code.SUCCESS) {
                    const { user_record, podcast_challenges, user, podcasts } = res.data;
                    const mapping = Helper.mapPodcastChallengeByPodcastId(podcast_challenges);
                    const podcast_listened = [] as PodcastChallengeListen[];

                    for (const podcast of podcasts) {
                        if (mapping[podcast.id]) {
                            podcast_listened.push({
                                podcast_challenge: mapping[podcast.id],
                                podcast: podcast
                            })
                        }
                    }

                    return {
                        user: user,
                        user_record: user_record,
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
            user: {} as RawUser,
            podcast_listened: [],
            user_record: {} as RawRecordChallengeUser
        }
    }, [selected_user_id]);

    return (
        <div className='ml-2'>
            <div className="ml-4 mt-3">
                <Performance {...performance} />
            </div>
            <div className="border-black-200" style={{ borderBottomWidth: 1 }}></div>
            <div className="mt-4 ml-4">
                <div className="flex mr-4">
                    <div className="w-1/2">
                        {user_record_state.loading && <div className="text-green-500 text-lg flex px-2 py-2 items-center">
                            <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters/></span>
                            <span >Loading...</span>
                        </div>}
                        {user_record_state && user_record_state.value && <div className="text-gray-600 text-lg"><span className="font-medium">{user_record_state.value.user.fullname}</span>'s performance</div>}
                        <table className="mt-4">
                            <tbody>
                                <tr className="border-black-200 py-1 text-gray-00" >
                                    <th className="font-medium pr-6">Podcast</th>
                                    <th className="font-medium pr-6">Time listen</th>
                                    <th className="font-medium pr-6">Point</th>
                                </tr>
                                {
                                    user_record_state && user_record_state.value &&
                                    user_record_state.value.podcast_listened.map((podcast_listen) => (
                                        <tr key={podcast_listen.podcast.id} className="text-base">
                                            <td className="pr-6">{podcast_listen.podcast.name}</td>
                                            <td className="pr-6">
                                                {Helper.getTimeListen(podcast_listen.podcast_challenge ? podcast_listen.podcast_challenge.time_listen : 0)}
                                            </td>
                                            <td className="pr-6">
                                                {(podcast_listen.podcast_challenge ? podcast_listen.podcast_challenge?.point / 100 : 0).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    user_record_state && user_record_state.value &&
                                    <tr className="border-black-200 py-1 text-gray-600" style={{ borderTopWidth: 1 }}>
                                        <td className="pr-6">Total</td>
                                        <td className="pr-6">{Helper.getTimeListen(user_record_state.value.user_record.time_listen)}</td>
                                        <td className="pr-6">{(user_record_state.value.user_record.point / 100).toFixed(2)}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="border-black-200" style={{ borderRightWidth: 1 }}></div>
                    <LeaderBoard items={members} handleData={setSelectedUserId} item_number={team_number} item_selected={selected_user_id} min_width={360} />
                </div>
            </div>
        </div>
    )
}

const SmallMenu = ({ team, is_admin, reloadAll, is_time_register,is_leave, closeModal }: { team: RawTeamChallenge, is_admin: boolean,is_time_register:boolean,is_leave:boolean, reloadAll: () => void, closeModal?: () => void }) => {
    const [open, setOpen] = useState(false);
    const [selected_form, setSelectedForm] = useState(false);
    const getForm = () => {
        setSelectedForm(!selected_form);
    }

    const unJoinTeam = async () => {
        try {
            const res: any = await Fetch.postWithAccessToken<{ team: RawTeamChallenge, code: number }>("/api/team.challenge/leave",
                { team_id: team.id }
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                reloadAll();
                if (closeModal) closeModal();
                Toast.success("Leave Team Successful!")
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }

    const onRemoveTeam = async () => {
        try {
            const res: any = await Fetch.postWithAccessToken<{ team: RawTeamChallenge, code: number }>("/api/team.challenge/remove",
                { team_id: team.id }
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                reloadAll();
                if (closeModal) {
                    closeModal();
                }
                Toast.success(`Remove team successful!`);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }

    return (
        <>
            <OutsideClickDetect outsideFunc={() => setOpen(false)}>
                <div className="flex relative flex-col justify-end items-end">

                    <span
                        onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                        className=" cursor-pointer px-1.5 py-1.5 mb-2 bg-white shadow-md text-lg rounded-full transition-all hover:bg-gray-200">
                        <HiDotsVertical/>
                    </span>

                    {open && <div className="top-full right-0 absolute z-30">
                        <div className="px-2 py-1 rounded-md shadow bg-white text-gray-600">
                            {
                                is_time_register && (
                                    <div onClick={getForm} className="cursor-pointer flex items-center outline-none focus:outline-none  mb-1 hover:text-primary-dark transition-all">
                                        <span className="mr-1"><AiFillEdit /></span>
                                        <span>Edit</span>
                                    </div>
                                )
                            }
                            {
                                is_leave && (
                                    <div onClick={unJoinTeam} className="cursor-pointer flex items-center outline-none focus:outline-none  mb-1 hover:text-primary-dark transition-all">
                                        <span className="mr-1"><FiLogOut /></span>
                                        <span>Out</span>
                                    </div>
                                )
                            }
                            {
                                is_admin && is_leave && (
                                    <>
                                        <div onClick={onRemoveTeam} className="cursor-pointer flex items-center outline-none focus:outline-none mb-1 hover:text-primary-dark transition-all">
                                            <span className="mr-1"><IoMdTrash /></span>
                                            <span>Delete</span>
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    </div>}
                </div>
            </OutsideClickDetect>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-11/12 xs:w-2/5"
                }}
                onClose={getForm} open={selected_form}>
                <>
                    {selected_form && (
                        <TeamForm team={team} reloadData={reloadAll} />
                    )}
                </>
            </Modal>
        </>
    )
}


const Register = ({ team, members, reloadAll }: { team: RawTeamChallenge, members: LeaderBoardItemProps[], reloadAll: () => void}) => {
    const me = MeHook.useMe();
    const is_admin = useMemo(() => {
        return me ? team.admin_ids.includes(me.id) : false;
    }, [me])

    const handleBan = async (member: LeaderBoardItemProps) => {
        try {
            const res: any = await Fetch.postWithAccessToken<{ team: RawTeamChallenge, code: number }>("/api/team.challenge/ban",
                { team_id: team.id, user_id: member.id }
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                reloadAll();
                Toast.success(`You deleted ${member.avatar.name}`);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!");
        }
    }

    return (
        <div className='ml-5 mt-2'>
            <div className="font-medium mt-4">Members</div>
            <div className="w-1/3 mt-2">
                {
                    members.map((member) => (
                        <div className="flex items-center" key={member.id}>
                            <LeaderBoardItem {...member} />
                            {
                                is_admin && (member.id != (me ? me.id : 0)) && (
                                    <div onClick={() => { handleBan(member) }} className="cursor-pointer hover:text-red-500">
                                        <RiDeleteBin2Fill/>
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default TeamRecord;
