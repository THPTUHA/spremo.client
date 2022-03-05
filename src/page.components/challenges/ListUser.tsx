import { useAsync } from 'react-use';
import { Helper } from '../../services/Helper';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { Code, MediaQuery } from '../../Constants';
import ListFilter from '../filter/_ListFilter';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { RawRecordChallengeUser, RawTeamChallenge, RawUser } from '../../store/types';
import AvatarTeam from '../../components/ui/AvatarTeam';
import { useLocation } from 'react-router-dom';
import Avatar from '../../components/ui/Avatar';
import { IoSearch } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface ResponseType {
    users: RawUser[],
    records: RawRecordChallengeUser[],
    message: string,
    user_num: number,
    code: number,
}

const mapRecordChallengeUser = (records: RawRecordChallengeUser[]) =>{
	return records.reduce((pre,cur )=>{
		return {...pre,[cur.user_id]: true};
	},{})as {[key:number]: boolean};
}

const ListUser = ({team}:{team: RawTeamChallenge})=>{
    const page_size = 10;
    const [page, setPage] = useState(1);
    const [q, setQ] = useState("");
    const loading = [1,2,3,4,5];

    const state = useAsync(async () => {
         try {
            if(q){
                const res = await Fetch.postWithAccessToken<ResponseType>('/api/user/search.user', {
                    q: q,
                    page: page,
                    page_size: page_size
                });

                if (res.status == 200) {
                    if (res.data && res.data.code == Code.SUCCESS) {
                        const {users,user_num} = res.data;
                        return {
                            users: users,
                            user_num: user_num
                        }
                    }
                    Toast.error(res.data.message);
                }
            }
            return {
                users: [],
                user_num: 0
            }
       } catch (error) {
           console.log(error);
           Toast.error("ERROR!");
       }
    }, [q,page]);
    return (
        <div className='mb-2  flex flex-col items-center'>
           <div className='flex items-center mb-4 w-full justify-center'>
                <IoSearch />
                <input onChange={e=>setQ(e.target.value)} type="text" placeholder=' Search team...' value={q} className="w-1/2 pl-1 h-8"/>
            </div>

            <div className='flex flex-col items-center mt-3 w-full'>
                {
                    state.loading ? (loading.map(e=><Replacement key={e}/>)):
                    state.value && state.value.users.map((user, index)=> (<UserItem key={user.id} user={user} team ={team} index={index}/>))
                }
            </div>
        </div>
    )
}


const UserItem = ({user,team }:{user: RawUser,team: RawTeamChallenge, index: number }) => {
    const [is_loading,setIsLoading] = useState(false);
    const [is_invite,setIsInvite] = useState(team.user_invited_ids.includes(user.id));
    const onInvite = async()=>{
        setIsLoading(true);
        try {
            const res: any = await Fetch.postWithAccessToken<{team: RawTeamChallenge, code: number }>("/api/team.challenge/invite", 
                {team_id: team.id , user_id: user.id}
            );
            if (res && res.data) {
                if (res.data.code != Code.SUCCESS) {
                    Toast.error(res.data.message)
                    setIsLoading(false);
                    return;
                }
                team.user_invited_ids.push(user.id);
                setIsInvite(true);
                Toast.success("Send invited!")
            }
       } catch (error) {
           console.log(error);
           Toast.error("ERROR!");
       }
       setIsLoading(false);
    }

    return (
        <>
           <div className='relative w-full py-2 ml-3  rounded-md' style={{minWidth:350,maxWidth:350}}>
                <div className="flex items-center justify-between">
                    <div className = "flex items-center">
                        <Avatar user={user} />
                        <div className="flex flex-col ml-2">
                            <div className='text-sm'>{user.fullname}</div>
                        </div>
                    </div>
                    <div className='ml-2'>
                        {
                            is_invite ?<div className='text-green-600'>Invited</div>
                            :team.user_ids.includes(user.id) ?<div className='text-blue-600'>In team</div>
                            : (
                                <a onClick={onInvite} className="cursor-pointer outline-none w-16 focus:outline-none bg-green-500 text-white flex items-center justify-center rounded font-medium  shadow hover:bg-green-600 transition-all">
                                    {is_loading && <span className="animate-spin text-sm mr-1"><AiOutlineLoading3Quarters /></span>}
                                    <span > Invite</span>
                                </a>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    )
};

const Replacement = () => {
	return (
		<div className="rounded-md max-w-sm w-full mx-auto hover:shadow">
        <div className="animate-pulse flex space-x-4 px-2 py-2">
            <div className="rounded-full bg-gray-400 h-8 w-8"></div>
            <div className="flex-1 space-y-6 py-1">
                <div className="h-6 bg-gray-300 rounded"></div>
            </div>
        </div>
        {/* <div class="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
  <div class="animate-pulse flex space-x-4">
    <div class="rounded-full bg-slate-700 h-10 w-10"></div>
    <div class="flex-1 space-y-6 py-1">
      <div class="h-2 bg-slate-700 rounded"></div>
      <div class="space-y-3">
        <div class="grid grid-cols-3 gap-4">
          <div class="h-2 bg-slate-700 rounded col-span-2"></div>
          <div class="h-2 bg-slate-700 rounded col-span-1"></div>
        </div>
        <div class="h-2 bg-slate-700 rounded"></div>
      </div>
    </div>
  </div>
</div> */}
        </div>
	);
}

export default ListUser;