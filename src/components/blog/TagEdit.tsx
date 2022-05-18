import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { useAsync } from "react-use";
import { Code, DRAFT, FRIEND, FRIEND_SPECIFIC, PRIVATE, PUBLIC, ROLES } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { StyleFunctions } from "../../store/style/functions";
import { StyleHook } from "../../store/style/hooks";
import { RawUser } from "../../store/types";
import OutsideHoverDetect from '../ui/OutsideHoverDetect';

const DevStatusOptions = [
    {  label: "Post Public", value: PUBLIC},
    {  label: "Draft", value: DRAFT},
]

const StatusOptions = [
    {  label: "Public", value: PUBLIC},
    {  label: "Private", value: PRIVATE},
    {  label: "Friend", value: FRIEND},
    {  label: "Friend specific", value: FRIEND_SPECIFIC},
]

const TagEdit =  ({blog}:{blog: any})=>{
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();
    const [open_friend, setOpenFriend] = useState(false);
    const [status,setStatus] = useState(blog.status); 
    const [tag,setTag] = useState("");
    const [tags, setTags] = useState<string[]>(blog.tags);
    const [editing, setEditing] = useState(false);
    const [friend_q, setFriendQ] = useState("");
    const [friend_ids , setFriendIds] = useState<number[]>([]);
    const [tag_hover, setTagHover] = useState(-1);

    const handleSave = async () => {
        try {
            const res = await Fetch.postWithAccessToken<{code: number,message: string}>("/api/me/blog.update",{
                id: blog.id,
                status: status,
                tags: JSON.stringify(tags)
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Save Successful");
                    setEditing(false);
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR!!");
        }
    }

    useEffect(()=>{
        if(status == FRIEND_SPECIFIC){
            setOpenFriend(true);
        }
    },[status])

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

    const handleUser = (user_id: number) => {
        if(friend_ids.includes(user_id)){
            setFriendIds(friend_ids.filter(id => id!=user_id))
        }else{
            setFriendIds([...friend_ids, user_id])
        }
    }

    const handleDeleteTag = (index: number) =>{
        tags.splice(index,1)
        setTags([...tags]);
    }
    
    return (
        <div>
            {
                !editing 
                    ?(
                        <div className='text-white ml-5 mt-3'>
                            {
                                me && blog.user && me.id == blog.user.id && blog.is_edit &&
                                <div onClick={()=>{setEditing(true)}} className="cursor-pointer">Edit</div>
                            }
                            <div className="flex flex-wrap">
                                {
                                    tags.map((tag,index) =>(
                                        <span key={index} className='text-white hover:bg-green-500 rounded px-2'>
                                            <Link to={`/search/${tag}`}>
                                                <div>#{tag}</div>
                                            </Link>
                                        </span>
                                    ))
                                }
                            </div>
                        </div>
                    )
                    :(
                        <div className='mt-4 text-white w-full' >
                            <div className='flex flex-wrap w-full'>
                                <div className='ml-3 flex flex-wrap  w-full mr-3'>
                                    {
                                        tags.map((tag,index) =>(
                                            <span key={index} onClick={()=>{handleDeleteTag(index)}} className='hover:bg-red-500  rounded px-2 cursor-pointer'>
                                               #{tag}
                                            </span>
                                        ))
                                    }
                                </div>
                            <input type="text" className='focus:outline-none border-none ml-3' 
                                placeholder="#tags"
                                style={{backgroundColor: style.bg_blog_color}} value={tag} 
                                onChange={(e)=>setTag(e.target.value)} 
                                onKeyDown={(e)=>{
                                    if(e.key == "Enter" && tag){
                                        tags.push(tag);
                                        setTags([...tags]);
                                        setTag("");
                                    }else if(e.key == "Backspace" && !tag){
                                        if(tags.length){
                                            tags.pop();
                                            setTags([...tags]);
                                        }
                                    }
                                }}/>
                            </div>
                            <div className="ml-4 mt-2">
                                <select value={status} 
                                    onChange={(e)=>setStatus(parseInt(e.target.value))} 
                                    className="focus:outline-none"
                                    style={{backgroundColor: style.bg_blog_color}}>
                                    {
                                        me?.role== ROLES.DEVELOPER ?
                                        DevStatusOptions.map(opt => (
                                            <option value={opt.value} key={opt.value}>{opt.label}</option>
                                        ))
                                        : StatusOptions.map(opt => (
                                            <option value={opt.value} key={opt.value}>{opt.label}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="ml-4">
                                <button onClick={handleSave} className="text-white font-medium">Save</button>
                            </div>
                            <Modal
                                classNames={{
                                    modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                                }}

                                onClose={()=>{setOpenFriend(false)}} open={open_friend}>
                                <>
                                {
                                    open_friend && (
                                        <div>
                                            <input type="text" value={friend_q} onChange={(e)=>{setFriendQ(e.target.value)}}/>
                                            {
                                                friends.loading ? <div>Loading...</div> : friends.value &&
                                                    <div>
                                                        {
                                                            friends.value.users.map((user)=>(
                                                                <div key={user.id} onClick={()=>{handleUser(user.id)}}>
                                                                    <input type="checkbox" checked={friend_ids.includes(user.id)} onChange={()=>{}}/>
                                                                    <img src={user.avatar} className="w-10 h-auto"/>
                                                                    <div>{user.username}</div>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                            }
                                        </div>
                                    )
                                }
                                </>
                            </Modal>
                        </div>
                    )

            }
        </div>
    )
}

export default TagEdit;