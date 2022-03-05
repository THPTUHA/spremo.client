import { useAsync } from 'react-use';
import { Helper } from '../../services/Helper';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { Code, MediaQuery, TeamStatus } from '../../Constants';
import ListFilter from '../filter/_ListFilter';
import { useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { RawChallenge, RawTeamChallenge } from '../../store/types';
import AvatarTeam from '../../components/ui/AvatarTeam';
import { useLocation } from 'react-router-dom';
import { rearg } from 'lodash';
import { MeHook } from '../../store/me/hooks';
import { IoSearch } from 'react-icons/io5';

interface ResponseType {
    teams: RawTeamChallenge[],
    message: string,
    team_num: number,
    code: number,
}

const ListTeam = ({challenge,reload, setReload}:{challenge: RawChallenge, reload: boolean, setReload: (value:boolean)=>void})=>{
    const page_size = 3;
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");

    const me = MeHook.useMe();
  const state = useAsync(async () => {
       try {
        const res = await Fetch.postWithAccessToken<ResponseType>('/api/team.challenge/list', {
            q: q,
            page: page,
            challenge_id: challenge.id,
            page_size: page_size
        });
        if (res.status == 200) {
            if (res.data && res.data.code == Code.SUCCESS) {
                console.log("ListTeam",res.data);
                const {teams, team_num} = res.data;
                return {
                    teams: teams,
                    team_num: team_num
                }
            }
            Toast.error(res.data.message);
        }
        return {
            teams: [],
            team_num: 0
        }
       } catch (error) {
           console.log(error);
           Toast.error("ERROR!");
       }
    }, [q,page,reload]);

    return (
        <div>
            <label className="text-base font-medium text-gray-600 mb-1.5 block" htmlFor="">Search Team </label>
            <div className='flex items-center'>
                <IoSearch/>
                <div className='ml-2'>
                    <input onChange={e=>setQ(e.target.value)} type="text" placeholder='search tean...' value={q}/>
                </div>
            </div>
            <div>
                {
                    state.loading && <div>Loading..........</div>
                }
            {
                state.value?(<div>
                        <div>Have {state.value.team_num} joined</div>
                        <div>
                            {
                               state.value.teams.map((team)=> <
                                   TeamItem key={team.id} team={team} max_member={challenge.challenge_type.team.number_member} reload={reload} setReload={setReload} user_id={me?me.id:0}/>)
                            }
                        </div>
                    </div>
                ):""
            }
            </div>
        </div>
    )
}

const TeamItem = ({team ,max_member,reload,user_id, setReload}:{team: RawTeamChallenge,max_member: number,reload:boolean,user_id: number,setReload:(value:boolean)=>void})=>{
    const [code, setCode] = useState("");
    const [is_request,setIsRequest] = useState(team.user_requested_ids.includes(user_id));

    const onJoin = async()=>{
        try {
            const res: any = await Fetch.postWithAccessToken<{team: RawTeamChallenge, code: number }>("/api/team.challenge/join", 
                {code: code, team_id: team.id}
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                setReload(!reload);
                Toast.success("Join Team Successful!")
            }
       } catch (error) {
           console.log(error);
           Toast.error("ERROR!");
       }
    }

    const onRequest = async()=>{
        try {
            const res: any = await Fetch.postWithAccessToken<{ code: number }>("/api/team.challenge/request", 
                { team_id: team.id}
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    return;
                }
                setIsRequest(true);
                Toast.success("Request sent!")
            }
       } catch (error) {
           console.log(error);
           Toast.error("ERROR!");
       }
    }

    return (
        <div>
            <div className='w-full py-1 ml-3 hover:bg-gray-100 rounded-md'style={{ minWidth: 320 }}>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-center">
                    <div className="text-gray-600 mr-3 flex items-center">
                        <AvatarTeam  team={team}/>
                        <div className='text-sm ml-2'>{team.name}</div>
                        <div className={team.user_ids.length==max_member?"text-green-500 ml-2":"text-red-500 ml-2"}>
                            {team.user_ids.length}/{max_member}
                        </div>
                        <div>
                            {
                                !team.user_ids.includes(user_id)?(
                                    <div>
                                    {
                                        (team.status == TeamStatus.PUBLIC)?(
                                            <div>
                                                <button onClick={onJoin} className='outline-none w-12 focus:outline-none bg-green-500 text-white flex items-center justify-center rounded font-medium  shadow hover:bg-primary-dark transition-all'>Join</button>
                                            </div>
                                        ):(
                                            <div>
                                                <input onChange={(e)=>setCode(e.target.value)} value={code} type="text" placeholder='enter code...'/>
                                                <button onClick={onJoin}>Submit</button>
                                                <div>
                                                    {
                                                        is_request?(
                                                            <div>Đã gửi request</div>
                                                        ):(
                                                            <button onClick={onRequest} className='outline-none w-16 focus:outline-none bg-green-500 text-white flex items-center justify-center rounded font-medium  shadow hover:bg-primary-dark transition-all'>
                                                            Request</button>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        )
                                    }
                                    </div>
                                ):""
                            }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListTeam;