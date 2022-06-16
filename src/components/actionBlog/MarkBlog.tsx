import { useState } from "react";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog } from "../../store/types";

const MarkBlog = ({blog}:{blog: RawBlog})=>{
    const [marked, setMarked] = useState(blog.is_marked);

    const handleMarkBlog = async () => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/blog/mark",{
               id: blog.id,
               marked: !marked
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    Toast.success("Unsave successfull!");
                    setMarked(!marked);
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
        <div className='cursor-pointer' onClick={handleMarkBlog}>
            {
                marked ?<BsBookmarkFill/> :<BsBookmark />
            }
        </div>
    )
}

export default MarkBlog;