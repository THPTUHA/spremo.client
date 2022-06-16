import { useEffect, useMemo, useState } from "react";
import { FaRegComment, FaRegPaperPlane } from "react-icons/fa";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import instanceFirebaseApp from "../../services/Firebase";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { RawBlog, RawComment } from "../../store/types";
import Loading from "../loading/Loading";


const CommentBlog = ({blog}: {blog: RawBlog})=>{
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
        blog.comment_number = Object.keys(comments).length;
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
        <div className='text-black mt-2'>
            <div className="border-[1px]"></div>
            <div className='mb-5 mt-3 mb-3'>
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
            {
                me && (
                    <div className='flex ml-5 mb-3'>
                        <img className='w-8 h-8 rounded' src={me?.avatar}/>
                        <textarea value={content} 
                            onChange={(e)=>{setContent(e.target.value)}} 
                            onKeyDown={handleKey}
                            className="rounded px-1 py-1  focus:outline-none ml-3"
                        />
                        <button onClick={hanhdleSendComment} className="ml-3 mr-4">
                            <FaRegPaperPlane className='w-6 h-auto text-white'/>
                        </button>
                        {loading && <Loading/> }
                    </div>
                )
            }
        </div>
    )
}


export default CommentBlog;