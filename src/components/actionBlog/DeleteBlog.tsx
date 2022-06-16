import { Dispatch, SetStateAction } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog } from "../../store/types";

const DeleteBlog = ({blog,setBlogs}:{blog: RawBlog, setBlogs: Dispatch<SetStateAction<RawBlog[]>>})=>{

    const handleDelete = async ()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/me/blog.delete",{
                id: blog.id
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    setBlogs(preState=>{
                        return preState.filter(item => item.id != blog.id);
                    })
                    Toast.success("Delete Successfull!");
                    // StyleFunctions.reset();
                }else{
                    Toast.error(message);
                }
            }
        } catch (error) {
            Toast.error("Emotional Damage!");
        }
    }

    return (
        <div>
            <RiDeleteBin6Line onClick={handleDelete} className='w-6 h-auto cursor-pointer'/>
        </div>
    )
}

export default DeleteBlog;