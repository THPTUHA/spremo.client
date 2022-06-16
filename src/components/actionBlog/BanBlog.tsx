import { Dispatch, SetStateAction, useState } from "react";
import { CgUnblock } from "react-icons/cg";
import { FaBan } from "react-icons/fa";
import Modal from "react-responsive-modal";
import { BAN, Code, PAGINATION_OPTION } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { StyleFunctions } from "../../store/style/functions";
import { RawBlog } from "../../store/types";

interface Props{
    blog: RawBlog,
    setBlogs: Dispatch<SetStateAction<RawBlog[]>>
}

const BanBlog = ({blog, setBlogs}: Props)=>{
    const [open_ban,setOpenBan] = useState(false);
    const [reason,setReason] = useState("");

    const handleBan = async(is_ban: boolean)=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number,message: string}>("/api/admin/ban.blog",{
               id: blog.id,
               reason: reason,
               is_ban: is_ban
            });

            if(res.data){
                const {code,message} = res.data;
                if(code == Code.SUCCESS){
                    setBlogs((preState)=>{
                        return preState.filter(item => item.id != blog.id);
                    })
                    StyleFunctions.reset();
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
            {blog.status == BAN 
                ?<CgUnblock onClick={()=>{handleBan(false)}} className='w-6 h-auto cursor-pointer'/>
                :<FaBan onClick={()=>{setOpenBan(true)}} className='w-6 h-auto cursor-pointer'/>
            }
            <Modal
                classNames={{
                    modal: "rounded-lg overflow-x-hidden w-2/5 h-32 relative "
                }}
                center
                onClose={()=>{setOpenBan(false)}} open={open_ban}>
                <>
                {
                    open_ban && <div className="-m-5 h-32 flex items-center justify-center">
                        <input type="text" className='focus:outline-none px-2 py-2 w-64 rounded' onChange={(e)=>setReason(e.target.value)} placeholder="Reason"/>
                        <button onClick={()=>{handleBan(true)}}  className="bg-red-500 px-2 py-1 rounded-lg w-16 h-10 text-white font-medium ml-3">
                            Ban
                        </button>
                    </div>
                }
                </>
            </Modal>
        </div>
    )
}

export default BanBlog;