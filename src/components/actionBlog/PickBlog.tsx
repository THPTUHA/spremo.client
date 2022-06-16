import { AiOutlineStar ,AiTwotoneStar} from "react-icons/ai";
import { Dispatch, SetStateAction } from "react";
import { Code, SELECTED } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { RawBlog } from "../../store/types";
import {useState} from 'react';

const PickBlog = ({blog, setBlogs}: {blog: RawBlog, setBlogs: Dispatch<SetStateAction<RawBlog[]>>})=>{
    const [selected, setSelected] = useState(blog.selected);

    const handlePickBlog =async () => {
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/pick.blog",{
               id: blog.id,
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    setSelected(selected > 0 ? 0 : SELECTED);
                    setBlogs(preState=>{
                        return preState.filter(item => item.id != blog.id);
                    })
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
       <div>
           {
               selected == SELECTED 
               ? <AiTwotoneStar onClick={handlePickBlog} className='w-6 h-auto cursor-pointer text-yellow-500'/>
               :<AiOutlineStar onClick={handlePickBlog} className='w-6 h-auto cursor-pointer'/>
           }
       </div>
    )
}

export default PickBlog;