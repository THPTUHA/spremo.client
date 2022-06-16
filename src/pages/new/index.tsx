import { useState,useEffect } from "react";
import { BsMusicNoteBeamed } from "react-icons/bs";
import { MdEditNote, MdOutlineDraw, MdOutlineSettingsVoice, MdOutlineTextFields } from "react-icons/md";
import Modal from "react-responsive-modal";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ROLES } from "../../Constants";
import { DrawFunctions } from "../../store/draw/functions";
import { EmotionHook } from "../../store/emotion/hooks";
import { MeHook } from "../../store/me/hooks";
import { StyleHook } from "../../store/style/hooks";
import { VoiceRecoderFunction } from "../../store/voice.recorder/functions";

const NewBlog = ()=>{
    const me = MeHook.useMe();
    const navgate = useNavigate();
    const style = StyleHook.useStyle();
    const location = StyleHook.useLocation();
    const emotion = EmotionHook.useEmotion();
    const [open_item, setOpenItem] = useState(0);
    const [open, setOpen] = useState(true);
    const navigative = useNavigate();

    const createDraw = async()=>{
        if(!me) return;
        const blog = await DrawFunctions.create(emotion.id);
        if(blog && blog.id){
            navgate(`../edit/${me.username}/${blog.id}`)
        }
    }

    const hanleClose = ()=>{
        setOpen(false);
        navigative(-1);
    }

    useEffect(()=>{
        let intervel:any;
        if(open_item == 1){
            setOpen(false);
            intervel = setTimeout(()=>{
                navigative("../new/music");
            },1000)
        }
        return ()=>{
            clearTimeout(intervel);
        }
    },[open_item])

    return (
        <Modal
            showCloseIcon = {false}
            classNames={{
                modal: "rounded-lg overflow-x-hidden w-1/2 relative"
            }}
            styles={{
                modal: {
                    backgroundColor:  "transparent",
                    boxShadow:"none"
                }
            }}
            center
            onClose={hanleClose} open={open}>
             <div className="flex w-full justify-around mb-5 py-2 w-full">
                {
                    me && me.role != ROLES.DEVELOPER && (
                        <Link 
                            to={`/new/note`}
                            state= {{ background: location }}
                            >
                            <div className="flex-col items-center cursor-pointer rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{backgroundColor: style.bg_blog_color}}>
                                <MdEditNote className="h-10 w-auto" style={{color: style.text_tool__color}}/>
                                <div className="text-white font-medium">Note</div>
                            </div>
                        </Link>
                    )
                }
                <Link to={`/new/text`}>
                    <div className="flex-col items-center cursor-pointer rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{backgroundColor: style.bg_blog_color}}>
                        <MdOutlineTextFields className="h-10 w-auto" style={{color: style.text_tool__color}}/>
                        <div className="text-white font-medium">Text</div>
                    </div>
                </Link>
                <div onClick={createDraw} className="flex-col items-center cursor-pointer  rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{backgroundColor: style.bg_blog_color}}>
                    <MdOutlineDraw className="h-10 w-auto"  style={{color: style.draw_tool_color}}/>
                    <div className="text-white font-medium">Draw</div>
                </div>
                <Link to={`/new/voice.record`}
                        state= {{ background: location }}
                >
                    <div className="flex-col items-center cursor-pointer  rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{backgroundColor: style.bg_blog_color}}>
                        <MdOutlineSettingsVoice className="h-10 w-auto"  style={{color: style.voice_tool_color}}/>
                        <div className="text-white font-medium">Voice</div>
                    </div>
                </Link>
                <div className="flex-col items-center cursor-pointer  rounded-full w-24 h-24 flex flex-col items-center justify-center" style={{backgroundColor: style.bg_blog_color}}>
                    {/* <BsMusicNoteBeamed className="h-10 w-auto text-blue-500"/>
                    <div>Music</div> */}
                    <Link
                            to={`/new/music`}
                            state= {{ background: location }}
                    >
                        <BsMusicNoteBeamed className="h-10 w-auto text-blue-500"/>
                        <div className="text-white font-medium">Music</div>
                    </Link>
                </div>
                {/* <div className="flex-col items-center cursor-pointer mr-10">
                    <AiOutlineVideoCamera className="h-10 w-auto"/>
                    <div>Video</div>
                </div> */}
            </div>
        </Modal>
    )
}

export default NewBlog;