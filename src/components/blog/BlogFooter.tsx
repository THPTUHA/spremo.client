import { FaBan, FaRegComment } from 'react-icons/fa';
import { RiDeleteBin6Line, RiShareForwardLine } from 'react-icons/ri';
import { BsBookmark, BsBookmarkFill, BsBookmarks, BsPencil} from 'react-icons/bs';
import { Link } from "react-router-dom";
import { MeHook } from '../../store/me/hooks';
import Fetch from '../../services/Fetch';
import { BLOG_TYPES, Code, EMOTION_IDS, PRIVATE, SHARE_OPTIONS, ROLES, FRIEND_SPECIFIC, EMOTIONS, SELECTED, BAN } from '../../Constants';
import { Toast } from '../../services/Toast';
import { VoiceRecoderFunction } from "../../store/voice.recorder/functions";
import { StyleFunctions } from '../../store/style/functions';
import Modal from 'react-responsive-modal';
import { useState ,useEffect, useMemo} from 'react';
import instanceFirebaseApp from '../../services/Firebase';
import { RawComment, RawUser } from '../../store/types';
import { AiOutlineHeart, AiOutlineStar,AiTwotoneStar  } from 'react-icons/ai';
import { BiAngry, BiHappyBeaming, BiSad } from 'react-icons/bi';
import { FaRegPaperPlane } from 'react-icons/fa';
import { useAsync } from 'react-use';
import LoadingNormal from '../loading/LoadingNormal';
import Emotion from '../emotion/Emotion';
import { StyleHook } from "../../store/style/hooks";
import { CgUnblock } from 'react-icons/cg';

const Comment = ({blog}: {blog: any})=>{
    const me = MeHook.useMe();
    const [content, setContent] = useState("");
    const [comments, setComments] = useState<{ [key: number]: any }>({});
    const [loading, setLoading] = useState(false);

    let observer: () => void

    useEffect(() => {
        const commentQuery = instanceFirebaseApp().firestore().collection("comments").doc("user_comment").collection(blog.id.toString());
        const query = commentQuery.orderBy("since", "desc");
        var new_value = { ...comments };
        observer = commentQuery.onSnapshot(querySnapShot => {
            // querySnapShot.docChanges().forEach((doc)=>{
            //     console.log("DOC", doc);
            // })
            querySnapShot.docChanges().forEach(change => {
                if (change.type == 'added') {
                    let comment = change.doc.data() as RawComment;
                    comment.id = parseInt(change.doc.id);
                    if (!comments[comment.id]) {

                        new_value = {
                            ...new_value,
                            [comment.id]: comment
                        }
                    }
                }

                if (change.type == 'modified') {
                    console.log("ModSnap",change);
                    let comment = change.doc.data() as RawComment;
                    comment.id = parseInt(change.doc.id);

                    new_value = {
                        ...new_value,
                        [comment.id]: comment
                    }
                }

                if (change.type == 'removed') {

                    delete new_value[parseInt(change.doc.id)]
                }
            });

            setComments(new_value);
        })
    }, [])
    
    const show_comments = useMemo(() => {
        blog.comment_count = Object.keys(comments).length;
        return Object.values(comments).sort((a, b) => {
            if (a.since > b.since) {
                return -1;
            }

            if (a.since < b.since) {
                return 1;
            }

            return 0;

        }) as RawComment[];
    }, [comments]);

    const handleKey = async(e:any)=>{
       if(e.key == 'Enter'){
           await hanhdleSendComment();
       }
    }
    const hanhdleSendComment = async()=>{
        try {
            setLoading(true);
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,comment: RawComment}>("/api/blog/comment.add",{
                blog_id: blog.id,
                content: content
            });

            if(res.data){
                const {code,message, comment} = res.data;
                if(code == Code.SUCCESS){
                    setContent("");
                    Toast.success("Send Successfull!");
                }else{
                    Toast.error(message);
                }
            }
            setLoading(false);
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    return (
        <div className='text-black mt-8'>
            <div className="border-[1px]"></div>
            <div className='mb-5 mt-3'>
                {
                    show_comments.map(comment =>(
                        <div key={comment.id} className='text-white flex items-center ml-5 mb-4'>
                            <img className='w-8 h-8 rounded' src={comment.user_avatar}/>
                            <div className='flex flex-col ml-3 border-[1px] border-white px-2 py-1 rounded'> 
                                <div className='font-medium text-sm'>{comment.username}</div>
                                <div>{comment.content}</div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='flex ml-5'>
                <img className='w-8 h-8 rounded' src={me?.avatar}/>
                <textarea value={content} 
                    onChange={(e)=>{setContent(e.target.value)}} 
                    onKeyDown={handleKey}
                    className="rounded px-1 py-1  focus:outline-none ml-3"
                />
                <button onClick={hanhdleSendComment} className="ml-3 mr-4">
                    <FaRegPaperPlane className='w-6 h-auto text-white'/>
                </button>
                {loading && <LoadingNormal/> }
            </div>
        </div>
    )
}



const getEmotion = (emotion_id: number)=>{
    for(let i = 0;i<EMOTIONS.length;++i){
        if(EMOTIONS[i].id == emotion_id) return <Emotion id={emotion_id}/>
    }
    return <AiOutlineHeart className="w-6 h-auto cursor-pointer"/>
}
const BlogFooter = ({blog}:{blog: any})=>{
    const me = MeHook.useMe();
    const [open_share, setOpenShare] = useState(false);
    const [open_comment,setOpenComment] = useState(false);
    const [open_emotion,setOpenEmotion] = useState(false);
    const [open_ban,setOpenBan] = useState(false);

    const [reason,setReason] = useState("");
    const [share_option,setShareOption] = useState(SHARE_OPTIONS[0]);
    const [friend_q, setFriendQ] = useState("");
    const [friend_ids , setFriendIds] = useState<number[]>([]);

    const [emotion_id, setEmotionId] = useState(blog.emotion_id);
    const [marked, setMarked] = useState(blog.is_marked);

    const style = StyleHook.useStyle();

    const handleDelete = async ()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,draw: any}>("/api/me/blog.delete",{
                id: blog.id
            });

            if(res.data){
                const {code,message, draw} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Delete Successfull!");
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    const handShare = async ()=>{
        try {
            const friend_ids = friends.value? friends.value.users.map(user =>user.id): [];
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,blog: any}>("/api/me/blog.share",{
                id: blog.id,
                share_option_id: share_option.id,
                friend_ids: JSON.stringify(friend_ids)
            });

            if(res.data){
                const {code,message, blog} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Share Successfull!");
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    const saveEmotion =async (emotion_id: number) => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string,blog: any}>("/api/blog/like",{
                id: blog.id,
                emotion_id: emotion_id
            });

            if(res.data){
                const {code,message, blog} = res.data;
                if(code == Code.SUCCESS){
                    setEmotionId(emotion_id);
                    setOpenEmotion(false);
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
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

    const handleUser = (user_id: number)=>{
       if(friend_ids.includes(user_id)){
           setFriendIds(friend_ids.filter(id => id!=user_id))
       }else{
           setFriendIds([...friend_ids, user_id])
       }
    }

    const handleBan = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/ban.blog",{
               id: blog.id,
               reason: reason
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Banned!");
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    const handleUnBan = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/unban.blog",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Unbanned!");
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    const handlePickBlog = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/pick.blog",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success(message);
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }
    
    const handleUnPickBlog =async () => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/unpick.blog",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success(message);
                    StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
    }

    const handleMarkBlog = async () => {
        console.log("MARK--");
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/blog/mark",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Save successfull!");
                    setMarked(true);
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
    }

    const handleUnMarkBlog = async () => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/blog/delete.mark",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Unsave successfull!");
                    setMarked(false);
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
    }
    return (
        <div className=' py-4'>
            <div className='flex justify-around text-white items-center'>
                {
                    blog.status == PRIVATE && me?.role != ROLES.DEVELOPER && 
                        <RiShareForwardLine onClick={()=>{setOpenShare(true)}} className='w-6 h-auto cursor-pointer'/>
                }

                {
                    <div onClick={()=>{setOpenEmotion(true)}}>
                        {getEmotion(emotion_id)}
                    </div>
                }
                
                {
                    me && me.id == blog.user_id && blog.is_edit 
                        && 
                        <RiDeleteBin6Line onClick={handleDelete} className='w-6 h-auto cursor-pointer'/>
                }
                <FaRegComment onClick={()=>{setOpenComment(!open_comment)}} className='w-6 h-auto cursor-pointer'/>
                {
                    me && me.id == blog.user_id && blog.is_edit && (
                        blog.type != BLOG_TYPES.AUDIO
                        ?<Link to={`/edit/${me?.username}/${blog.id}`}>
                            <BsPencil className='w-6 h-auto cursor-pointer'/>
                        </Link>
                        :<BsPencil onClick={()=> {VoiceRecoderFunction.open(blog.data.url,false,blog.id)}} className='w-6 h-auto cursor-pointer'/>
                )}
                {
                    me && me.id != blog.user_id && (
                        <div className='cursor-pointer'>
                            {
                                marked ?<BsBookmarkFill onClick={handleUnMarkBlog}/> :<BsBookmark onClick={handleMarkBlog}/>
                            }
                        </div>
                    )
                }
                {/* {
                    me && me.id == blog.user_id && blog.is_edit &&(
                        <>
                            {
                                blog.type != BLOG_TYPES.AUDIO ?
                                    <Link to={`/edit/${me.username}/${blog.id}`}>
                                    <BsPencil className='w-6 h-auto cursor-pointer'/>
                                </Link>:<BsPencil onClick={()=> {VoiceRecoderFunction.open(blog.data.url,false,blog.id)}} className='w-6 h-auto cursor-pointer'/>
                            }
                        </>
                    )
                } */}
                {/* <Link to={`/edit/${me?.username}/${blog.id}`}>
                                    <BsPencil className='w-6 h-auto cursor-pointer'/>
                                </Link> */}

            
                {blog.is_censored && (blog.status == BAN 
                    ?<CgUnblock onClick={handleUnBan} className='w-6 h-auto cursor-pointer'/>
                    :<FaBan onClick={()=>{setOpenBan(true)}} className='w-6 h-auto cursor-pointer'/>)
                }

                {blog.is_censored && (blog.selected == SELECTED
                    ? <AiTwotoneStar onClick={handleUnPickBlog} className='w-6 h-auto cursor-pointer'/>
                    : <AiOutlineStar onClick={handlePickBlog} className='w-6 h-auto cursor-pointer'/>)
                }

                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                    }}

                    onClose={()=>{setOpenEmotion(false)}} open={open_emotion}>
                    <>
                    {
                        open_emotion && <div >
                           {
                                EMOTIONS.map(emotion => <div key={emotion.id} onClick={()=>{saveEmotion(emotion.id)}}>
                                    <Emotion id={emotion.id} />
                                </div>)
                            }
                        </div>
                    }
                    </>
                </Modal>

                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-2/5 h-32 relative "
                    }}
                    center
                    onClose={()=>{setOpenBan(false)}} open={open_ban}>
                    <>
                    {
                        open_ban && <div style={{backgroundColor: style.bg_blog_color}} className="-m-5 h-32 flex items-center justify-center">
                            <input type="text" className='focus:outline-none px-2 py-2 w-64 rounded' onChange={(e)=>setReason(e.target.value)} placeholder="Reason"/>
                            <button onClick={handleBan}  className="bg-red-500 px-2 py-1 rounded-lg w-16 h-10 text-white font-medium ml-3">
                                Ban
                            </button>
                        </div>
                    }
                    </>
                </Modal>

                <Modal
                    classNames={{
                        modal: "rounded-lg overflow-x-hidden w-2/5 relative"
                    }}
                    center
                    onClose={()=>{setOpenShare(false)}} open={open_share}>
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
                                        <input type="text" value={friend_q} onChange={(e)=>{setFriendQ(e.target.value)}}/>
                                    )
                                }
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
                                <button onClick={handShare} className="py-2 px-2 bg-blue-500 rounded font-medium text-white">
                                    Share
                                </button>
                            </div>
                        )
                    }
                    </>
                </Modal>
            </div>
            {open_comment && <Comment blog={blog}/>}
        </div>
    )
}

export default BlogFooter;