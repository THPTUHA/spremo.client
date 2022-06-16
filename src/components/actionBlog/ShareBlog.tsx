import { useState } from "react";
import { RiShareForwardLine } from "react-icons/ri";
import Modal from "react-responsive-modal";
import { useAsync } from "react-use";
import { Code, FRIEND_SPECIFIC, SHARE_OPTIONS } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog, RawUser } from "../../store/types";
import {StyleFunctions} from '../../store/style/functions';

const ShareBlog = ({blog,sharing}:{blog: RawBlog, sharing?: boolean})=>{
    const [open_share, setOpenShare] = useState(sharing? true: false);

    const [friend_q, setFriendQ] = useState("");
    const [friend_ids , setFriendIds] = useState<number[]>([]);

    const [share_option,setShareOption] = useState(SHARE_OPTIONS[0]);

    const handleSelectUser = (user_id: number)=>{
        if(friend_ids.includes(user_id)){
            setFriendIds(friend_ids.filter(id => id!=user_id))
        }else{
            setFriendIds([...friend_ids, user_id])
        }
     }

    const friends = useAsync(async()=>{
        if(!friend_q) return;
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,users: RawUser[]}>("/api/me/friend.list",{
                q: friend_q
            });

            if(res.data){
                const {code,message, users} = res.data;
                if(code == Code.SUCCESS){
                    return {
                        users: users
                    }
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
        return{
            users: []
        }
    },[friend_q])

    const handShare = async ()=>{
        try {
            const friend_ids = friends.value? friends.value.users.map(user =>user.id): [];
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/me/blog.share",{
                id: blog.id,
                share_option_id: share_option.id,
                friend_ids: JSON.stringify(friend_ids)
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    setOpenShare(false);
                    StyleFunctions.reset();
                    Toast.success("Share Successfull!");
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    return (
        <>
            {sharing == undefined && <RiShareForwardLine onClick={()=>{setOpenShare(true)}} className='w-6 h-auto cursor-pointer'/>}
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5 relative text-white"
                }}
                center
                styles={{
                    modal: {
                        backgroundColor: "black"
                    }
                }}
                onClose={()=>{setOpenShare(false)}} open={open_share}
                >
                <>
                    {
                        open_share && (
                            <div>
                                {
                                    SHARE_OPTIONS.map((share)=>(
                                        <div key={share.id} className="mb-3">
                                            <input type="checkbox" onChange={()=>{setShareOption(share)}} checked={share_option.id == share.id}/>
                                            <label className='ml-2'>{share.title}</label>
                                        </div>
                                    ))
                                }
                                {
                                    share_option.id == FRIEND_SPECIFIC && (
                                       <div className="w-full mb-3">
                                            <input type="text" 
                                            value={friend_q} 
                                            onChange={(e)=>{setFriendQ(e.target.value)}}
                                            className = "bg-black outline-none "
                                            placeholder="Username..."
                                            />
                                       </div>
                                    )
                                }
                                {
                                    friends.loading ? <div>Loading...</div> : friends.value &&
                                        <div>
                                            {
                                                friends.value.users.map((user)=>(
                                                    <div key={user.id} onClick={()=>{handleSelectUser(user.id)}} className="flex mb-2 px-2 py-2 items-center hover:bg-gray-800">
                                                        <input type="checkbox" checked={friend_ids.includes(user.id)} onChange={()=>{}}/>
                                                        <img src={user.avatar} className="w-10 h-10 rounded ml-3"/>
                                                        <div className="font-medium ml-3">{user.username}</div>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                }
                                <button onClick={handShare} className="py-1 px-2 bg-blue-500 rounded font-medium text-white">
                                    Share
                                </button>
                            </div>
                        )
                    }
                </>
            </Modal>
        </>
    )
}

export default ShareBlog;