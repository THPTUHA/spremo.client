import { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import { useAsync } from "react-use";
import { BLOG_TYPES, Code, DRAFT, EMOTIONS, FRIEND, FRIEND_SPECIFIC, PRIVATE, PUBLIC, ROLES } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { StyleFunctions } from "../../store/style/functions";
import { StyleHook } from "../../store/style/hooks";
import { RawBlog, RawUser } from "../../store/types";
import ShareBlog from "../actionBlog/ShareBlog";
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

const getColorTagEmotion = (tag: string)=>{
    for(const emotion of EMOTIONS){
        if(tag.length && tag.trim() && tag.toLowerCase() == emotion.lable){
            return  emotion.color;
        }
    }
}
const TagEdit =  ({blog, handleSaveBlog,handleCancelBlog, is_edit}:{blog: RawBlog, handleSaveBlog?: any, is_edit?: boolean,handleCancelBlog?:any})=>{
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();
    const [open_friend, setOpenFriend] = useState(false);
    const [status,setStatus] = useState(blog.status); 
    const [tag,setTag] = useState("");
    const [tags, setTags] = useState<string[]>(blog.tags ? [...blog.tags]: []);
    const [editing, setEditing] = useState(is_edit? true:false);

    const handleSave = async () => {
        try {
            if(handleSaveBlog){
                await handleSaveBlog({
                    status: status,
                    tags: JSON.stringify(tags),
                });
                return;
            }
            const res = await Fetch.postWithAccessToken<{code: number,message: string}>("/api/me/blog.update",{
                id: blog.id,
                status: status,
                tags: JSON.stringify(tags),
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


    const handleCancel = ()=>{
        setEditing(false);
        if(handleCancelBlog){
            handleCancelBlog();
        }
    }


    const handleDeleteTag = (index: number) =>{
        tags.splice(index,1)
        setTags([...tags]);
    }
    
    const editTagEmotion = (name: string)=>{
        if(tags.includes(name)){
            setTags(tags.filter(tag => tag!= name))
        }else{
            tags.push(name);
            setTags([...tags]);
        }
    }
    return (
        <div className="mb-3 text-white">
            <div className="flex justify-around w-full">
            </div>
            {
                !editing 
                    ?(
                        <div className='text-white ml-5 mt-3'>
                            {
                                me &&  blog.is_edit &&
                                <div onClick={()=>{setEditing(true)}} className="cursor-pointer">Edit Tags</div>
                            }
                            <div className="flex flex-wrap">
                                {
                                    tags.map((tag,index) =>(
                                        <span key={index} 
                                            className={`hover:bg-green-500 rounded px-2 underline italic border-${getColorTagEmotion(tag)}`}>
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
                            <div className="flex justify-around mb-3">
                            {
                                EMOTIONS.map(emotion=>{
                                    return (
                                        <div key={emotion.id} 
                                            className={`${tags.includes(emotion.lable) ? 'border-[4px] ':'border-[2px] '} ${emotion.border_color} rounded w-16 text-center cursor-pointer`}
                                            onClick={()=>{editTagEmotion(emotion.lable)}}>
                                            #{emotion.lable}
                                        </div>
                                    )
                                })
                            }
                            </div>
                            <div className='flex flex-wrap w-full'>
                                <div className='ml-3 flex flex-wrap  w-full mr-3'>
                                    {
                                        tags.map((tag,index) =>(
                                            <span key={index} onClick={()=>{handleDeleteTag(index)}} className='hover:bg-red-500  rounded px-2 cursor-pointer underline italic'>
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
                                {open_friend &&  <ShareBlog blog={blog}/>}
                            </div>
                            <div className="ml-4 flex justify-around"> 
                                <button onClick={handleSave} className="text-white font-medium">Save</button>
                                <button onClick={handleCancel} className="text-white font-medium">Cancel</button>
                            </div>
                        </div>
                    )

            }
        </div>
    )
}

export default TagEdit;