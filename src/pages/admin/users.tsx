import { useState } from "react";
import { useAsync } from "react-use";
import { Code, ROLES } from "../../Constants";
import Fetch from '../../services/Fetch';
import { RawUser } from "../../store/types";
import { Toast } from '../../services/Toast';
import { AiOutlineSearch } from "react-icons/ai";

interface Response{
    users: RawUser[],
    code: number,
    message: string
}


const AdminUsers = ()=>{
    const [q,setQ] = useState("");

    const state = useAsync(async () => {
        const res = await Fetch.postWithAccessToken<Response>('/api/user/list', {
            q: q
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message, users} = res.data;
                if(code == Code.SUCCESS){
                    return {
                        users: users
                    }
                }
                Toast.error(message);
            }
        }

        return {
            users: []
        }
    }, [q]);

    const handleBan = async(user_id: number)=>{
        const res = await Fetch.postWithAccessToken<Response>('/api/admin/ban.user', {
            id: user_id
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Banned!")
                }
                Toast.error(message);
            }
        }

    }

    const handleUnBan = async(user_id: number)=>{
        const res = await Fetch.postWithAccessToken<Response>('/api/admin/ban.user', {
            id: user_id
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Banned!")
                }
                Toast.error(message);
            }
        }

    }

    const handlePromote = async(user_id: number)=>{
        const res = await Fetch.postWithAccessToken<Response>('/api/admin/promote.user', {
            id: user_id
        });

        if (res.status == 200) {
            if (res.data) {
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Promoted!")
                }
                Toast.error(message);
            }
        }

    }
    return(
        <div className="flex flex-col items-center">
             <div className="flex items-center w-1/2 bg-white rounded-lg">
                <label htmlFor='search_user' className='cursor-pointer pl-3'>
                    <AiOutlineSearch className='w-6 h-6 text-black'/>
                </label>
                <input value={q} 
                    className="px-2 py-2 text-black focus:outline-none "
                    onChange={(e)=>{setQ(e.target.value)}}
                    id="search_user" placeholder='Search User'
                />
            </div>
            <div className="w-1/2 mt-5">
                {state.loading ? <div>Loading...</div>: state.value &&
                    <div className="w-full">
                        {
                            state.value.users.map((user)=>(
                                <div key={user.id} className="flex w-full justify-between mb-4">
                                    <img src={user.avatar} className="w-8 h-8 rounded-full"/>
                                    <div>{user.username}</div>
                                    <div className="">
                                        {
                                            user.role == ROLES.ADMIN ?(
                                                <span>Admin</span>
                                            )
                                            :user.role == ROLES.CENSOR ? (
                                                <span>Censor</span>
                                            )
                                            :user.role == ROLES.DEVELOPER ? (
                                                <span>Developer</span>
                                            )
                                            :user.role == ROLES.USER ? (
                                                <span>User</span>
                                            ):""
                                        }
                                    </div>
                                    <div className="">
                                        {
                                            (user.role == ROLES.CENSOR 
                                            || user.role == ROLES.DEVELOPER 
                                            || user.role == ROLES.USER) ? ((user.active_status != -1 ) && (user.active_status != -2 )) && (
                                                <button onClick={()=>{handleBan(user.id)}}  className="bg-red-500 px-2 py-1 rounded-lg w-12">
                                                    Ban
                                                </button>
                                            ):(user.role != ROLES.ADMIN) &&(
                                                <button onClick={()=>{handleUnBan(user.id)}}  className="bg-red-500 px-2 py-1 rounded-lg w-24">
                                                    UnBan
                                                </button>
                                            )
                                        }
                                    </div>
                                    <div className="">
                                        {
                                            user.role == ROLES.USER && (
                                                <button onClick={()=>{handlePromote(user.id)}} className="bg-green-500 px-2 py-1 rounded-lg w-12">
                                                    Promote
                                                </button>
                                            )
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
        </div>
    )
}

export default AdminUsers;