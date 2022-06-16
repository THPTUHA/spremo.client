import { Dispatch, SetStateAction, useState } from "react";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineRead } from "react-icons/ai";
import { BiMessageSquareMinus } from "react-icons/bi";
import { BsMusicNote, BsPlusSquareDotted } from "react-icons/bs";
import { MdOutlineDone } from "react-icons/md";
import Modal from "react-responsive-modal";
import { useAsync } from "react-use";
import Emotion from "../../components/emotion/Emotion";
import { BLOG_TYPES, Code, EMOTIONS, SETTINGS } from "../../Constants";
import Fetch from "../../services/Fetch";
import { RawBlog, RawMusic, RawSetting } from "../../store/types";
import { Toast } from "../../services/Toast";
import Loading from "../../components/loading/Loading";
import { GrLinkPrevious } from "react-icons/gr";
import { StyleHook } from "../../store/style/hooks";

const Settings = [
    {
        id:1, icon: <BsMusicNote /> ,action: SETTINGS[0].action, lable: "Listen Music"
    },
    {
        id:3, icon: <BiMessageSquareMinus /> ,action: SETTINGS[2].action, lable: "Reminder"
    }
]

interface Response{
    code: number, 
    message: string, 
    blogs: RawBlog[]
} 

const ListMusic = ({blog_selected, setBlogSelected}:{blog_selected: RawBlog[], setBlogSelected: (selected:RawBlog[])=>void})=>{
    const [name, setName] = useState("");
    const style = StyleHook.useStyle();

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<Response>( '/api/me/blog.list',{
                content_search: name,
                type: BLOG_TYPES.MUSIC
            })
            if(res.data){
                const {code, message,blogs} = res.data;
                if(code == Code.SUCCESS){
                    return {
                        blogs: blogs
                    }
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }   
        return {
            blogs: []
        }    
    },[name])

    const handleSelected = (blog_extra: RawBlog)=>{
        let exist = false;
       for(const blog of blog_selected){
           if(blog.id == blog_extra.id){
                exist = true;
                break;
           }
       }

       if(exist){
           setBlogSelected([]);
       }else{
           setBlogSelected([...blog_selected, blog_extra]);
       }
    }
    return (
        <div>
            <div>
                {
                    blog_selected.map(blog =>(
                        <div key={blog.id} onClick={()=>{handleSelected(blog)}} className="flex items-center mb-3 cursor-pointer">
                            <img 
                                src={(blog.data as RawMusic).background}
                                className="w-8 h-8 rounded mr-3"
                                />
                            <div>{(blog.data as RawMusic).name}</div>
                        </div>
                    ))
                }
            </div>
            <input  type="text" 
                    placeholder="Name..." 
                    onChange={(e)=>{setName(e.target.value)}}
                    className = "outline-none text-white"
                    style={{backgroundColor: style.bg_blog_color}}
                    />
            {
                state.loading ? <Loading/>  
                : state.value  && state.value.blogs.map(blog =>(
                    <div key={blog.id} onClick={()=>{handleSelected(blog)}} className="flex items-center mb-3 cursor-pointer">
                        <img 
                            src={(blog.data as RawMusic).background}
                            className="w-8 h-8 rounded mr-3"
                            />
                        <div>{(blog.data as RawMusic).name}</div>
                    </div>
                )) 
            }
        </div>
    )
}
const Setting = ({setting,setOpen, setSettings}:{setting: RawSetting, setOpen: (value: boolean)=>void, setSettings: Dispatch<SetStateAction<RawSetting[]>>})=>{
    const [open_emotion,setOpenEmotion] = useState(false);
    const [emotion_id, setEmotionId] = useState(setting.emotion_id);
    const [action, setAction] = useState(setting.action);
    const [is_random, setIsRandom] = useState(setting.type == "random");
    const [blog_selected, setBlogSelected] = useState<RawBlog[]>(setting.blogs? setting.blogs: []);
    const [reminder, setReminder] = useState(setting.data.reminder);
    const style = StyleHook.useStyle(); 
    
    const hanldeSave =async () => {
        const url = setting.id ? "/api/me/setting.edit": "/api/me/setting.save";

        try {
            const res = await Fetch.postJsonWithAccessToken<{
                code: number,
                message: string,
                setting: RawSetting
            }>(url,{
                action: action, 
                type: is_random? "random": "select",
                data: JSON.stringify({
                    blog_ids: blog_selected.map(blog => blog.id),
                    reminder: reminder
                }), 
                emotion_id: emotion_id
            })
    
            if(res.data){
                const {code, message, setting} = res.data;
                if(code == Code.SUCCESS){
                    setSettings(preState =>{
                        return [
                            ...preState,
                            setting
                        ]
                    })
                    setOpen(false);
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("ERROR~~");
        }
    }

    return (
        <div className="w-full border-b-[1px] boder-white mt-5">
           <div className="flex items-center">
                <span>When </span>
                <div onClick={()=>{setOpenEmotion(true)}} className="ml-4" >
                    <Emotion id={emotion_id}/>
                </div>
           </div>

            <div className="mt-4">
                <div className="flex items-center">
                <span>You want</span>
                    {
                        !action && (
                            <button onClick={()=>{setAction("listen_music")}} 
                                style={{backgroundColor:style.bg_blog_color}}
                                className="flex px-4 py-3 rounded ml-5"
                                >
                                <BsMusicNote className="w-8 h-auto text-purple-500 mr-3"/>
                                <span>Listen music</span>
                            </button>
                        )
                    }

                    {
                        !action && (
                            <button onClick={()=>{setAction("reminder")}} 
                                style={{backgroundColor:style.bg_blog_color}}
                                className="flex px-4 py-3 rounded ml-5"
                                >
                                <BiMessageSquareMinus className="w-8 h-auto text-pink-500 mr-3"/>
                                <span>Reminder</span>
                            </button>
                        )
                    }
                </div>

                {
                    action == "listen_music" && (
                        <div className="flex items-center mt-5 mb-5">
                            <div
                                style={{backgroundColor:style.bg_blog_color}}
                                className="flex flex-col px-4 py-3 rounded mr-5"
                                >
                                <div className="flex rounded mr-5">
                                    <BsMusicNote className="w-8 h-auto text-purple-500 mr-3"/>
                                    <span>Listen music</span>
                                </div>
                                <button onClick={()=>{setIsRandom(!is_random)}}
                                    className={`${is_random ? "bg-green-500":""} mt-3 mb-3`}
                                    >
                                    Random
                                </button>
                                {!is_random && <ListMusic blog_selected={blog_selected} setBlogSelected={setBlogSelected}/>}
                            </div>
                        </div>
                    )
                }
                
                {
                    action == "reminder" && (
                        <button  style={{backgroundColor:style.bg_blog_color}}
                                className="flex flex-col px-4 py-3 rounded mr-5">
                            <div className="flex rounded mr-5">
                                <BiMessageSquareMinus className="w-8 h-auto text-pink-500 mr-3"/>
                                <span>Reminder</span>
                            </div>
                            <div onClick={()=>{setIsRandom(!is_random)}}
                                className={`${is_random ? "bg-green-500":""} mt-3 mb-3`}
                                >
                                Random
                            </div>
                            {!is_random && 
                            <div>
                                <input type="text" 
                                    value={reminder} 
                                    onChange={(e)=>{setReminder(e.target.value)}}
                                    className="outline-none"
                                    style={{backgroundColor: style.bg_blog_color}}
                                    placeholder = "Reminder"
                                    />
                            </div>}
                        </button>
                    )
                }
                {/* {
                    action != "" && <GrLinkPrevious onClick={()=>{setAction("")}}/>
                } */}
                <GrLinkPrevious 
                    onClick={()=>{setAction("")}}
                    className = "bg-white"
                    />
            </div>

            <div className="flex items-center mb-4 mt-4">
                <button onClick={hanldeSave}
                        className=" mr-5"
                        >
                        Save
                </button>
                <button onClick={()=>{setOpen(false)}}>
                    Cancel
                </button>
            </div>
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                }}
                center
                onClose={()=>{setOpenEmotion(false)}} open={open_emotion}>
                    <div className="flex justify-around w-full">
                        {
                            EMOTIONS.map(emotion => <div key={emotion.id} onClick={()=>{setEmotionId(emotion.id)}}>
                                <Emotion id={emotion.id} />
                            </div>)
                        }
                    </div>
            </Modal>
        </div>)
}

const setting_init: RawSetting = {
    id: 0,
    emotion_id: 0,
    type: "",
    action: "",
    data: {
        blog_ids: [],
        reminder: ""
    },
    blogs: []
}

const Action = ()=>{
    const [open, setOpen] = useState(false);
    const [setting, setSetting] = useState(setting_init);
    const [settings, setSettings] = useState<RawSetting[]>([]);

    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{
                code: number, message: string, settings: RawSetting[],blogs: RawBlog[]
                }>( '/api/me/setting.list',{
            })
            if(res.data){
                const {code, message,settings,blogs} = res.data;
                if(code == Code.SUCCESS){
                    console.log("Setting",settings);
                    setSettings(settings);
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }   
    },[])

    const hanldeDelete = async (setting_id: number)=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{
                code: number, message: string
                }>( '/api/me/setting.delete',{
                    setting_id: setting_id
            })

            if(res.data){
                const {code, message} = res.data;
                if(code == Code.SUCCESS){
                    setSettings(settings.filter(setting => setting.id != setting_id));
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }   
    }
    return (
        <div className="w-full">  
            <div className="font-medium text-lg mb-4">What do you want to do when...</div>
            <div onClick={()=>{
                setSetting(setting_init);
                setOpen(true);
            }}>
                {!open && <BsPlusSquareDotted className="w-8 h-auto cursor-pointer mb-4"/>}
            </div>
            {open && <Setting setting={setting} setOpen={setOpen} setSettings={setSettings}/>}
            {state.loading ? <Loading/>
                :  settings.map((setting)=>(
                    <div key={setting.id} className="flex w-1/2 justify-between mt-4" >
                        <Emotion id={setting.emotion_id}/>
                        {setting.action == "listen_music" 
                            ? (
                                <div className="flex items-center">
                                    <BsMusicNote className="w-8 h-auto text-purple-500 mr-3"/> 
                                    <div>Listen music</div>
                                </div>
                            )
                            :<div className="flex items-center">
                                <BiMessageSquareMinus className="w-8 h-auto text-pink-500 mr-3"/> 
                                <div>Reminder</div>
                            </div>
                        }
                        {setting.type == "random" ? "Random":"" }
                        
                        <div className="flex items-center">
                            <AiOutlineEdit onClick={()=>{
                                setSetting(setting);
                                setOpen(true);
                            }}className="w-8 h-auto text-white cursor-pointer"/>

                            <AiOutlineDelete 
                                onClick={()=>{hanldeDelete(setting.id)}}
                                className="w-8 h-auto text-red-500 ml-4 cursor-pointer"
                                />
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default Action;