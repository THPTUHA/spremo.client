import { MeHook } from "../../store/me/hooks";
import { RawUser } from "../../store/types";
import Follow from "../actionUser/Follow";
import Represent from "./Represent";

interface Props{
    users: RawUser[]
} 

const UserFollow = ({user}:{user: RawUser})=>{
    return (
        <div className="flex items-center w-full hover:bg-gray-800 py-1 px-1">
            <div className="flex items-center">
                <Represent 
                    user={user} 
                    size={38}
                />
            </div>
            <div className="flex flex-col ml-4">
                <div className="font-medium">{user.username}</div>
                <div className="text-sm">{user.recent_post_number} recent posts</div>
            </div>
        </div>
    )
}

const UserBar = ({user}:{user: RawUser})=>{
    const me = MeHook.useMe();
    return (
        <div className="flex items-center w-full hover:bg-gray-800 py-1 px-1 justify-between">
            <div className="flex items-center">
                <Represent 
                    user={user} 
                    size={38}
                />
                    <div className="font-medium ml-3">{user.username}</div>
            </div>
            <div className="mr-4 font-medium">
                {me?.id != user.id && <Follow user={user} in_chart={true}/>}
            </div>
        </div>
    )
}

const UserList = ({users}: Props)=>{
    return (
        <div className="w-full">
            {
                users.map(user => (
                    <div key={user.id} 
                        className="flex items-center mb-4 h-12 w-full"
                        >
                        {
                            user.recent_post_number == -1 
                                ? <UserBar user={user}/>
                                : <UserFollow user={user}/>
                        }
                    </div>
                ))
            }
        </div>
    )
}

export default UserList;