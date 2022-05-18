import { useState } from "react";
import { AiTwotoneLock } from "react-icons/ai";
import { BsThreeDots } from "react-icons/bs";
import { MdPublic } from "react-icons/md";
import { PRIVATE,BAN } from "../../Constants";
import { Helper } from "../../services/Helper";
import OutsideClickDetect from "../ui/OutsideClickDetect";

const SmallMenu = ({ blog }: { blog: any }) => {
    const [open, setOpen] = useState(false);

    return (<>
        <OutsideClickDetect outsideFunc={() => setOpen(false)}>
            <div className="flex relative flex-col justify-end items-end">

                <span
                    onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                    className=" cursor-pointer px-1.5 py-1.5 mb-2  bg-gray-500 shadow-md text-lg rounded-full transition-all hover:bg-gray-400">
                    <BsThreeDots className="text-white"/>
                </span>

                {open && <div className="top-full right-0 absolute ">
                    <div>
                        <span>Posted :</span>
                        <span>{Helper.getDateInputFormat(blog.created_time)}</span>
                    </div>
                </div>}
            </div>
        </OutsideClickDetect>

    </>)
}


const BlogHeader = ({blog}:{blog:any})=>{
    return <div className="justify-around flex justify-between">
        <div>
        {
            blog.is_edit && (
                <div className="mt-4 ml-4">
                    {
                        blog.status == PRIVATE ?  <AiTwotoneLock/>
                        :blog.status == BAN ? <div className="font-medium text-red-500">Banned</div>:
                         <MdPublic/>
                    }    
                </div>
            )
        }
        </div>
        <div className="mt-3 w-full mr-3">
            <SmallMenu blog={blog}/>
        </div>
    </div>
}

export default BlogHeader;