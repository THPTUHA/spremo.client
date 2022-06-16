import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { AiTwotoneLock } from "react-icons/ai";
import { BsEyeglasses } from "react-icons/bs";
import { BsThreeDots } from "react-icons/bs";
import { MdPublic } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { PRIVATE,BAN, ROLES, BLOG_LIST_LAYOUT } from "../../Constants";
import { Helper } from "../../services/Helper";
import { MeHook } from "../../store/me/hooks";
import { StyleHook } from "../../store/style/hooks";
import { RawBlog } from "../../store/types";
import MarkBlog from "../actionBlog/MarkBlog";
import PickBlog from "../actionBlog/PickBlog";
import OutsideClickDetect from "../ui/OutsideClickDetect";
import Represent from "../user/Represent";

const SmallMenu = ({ blog }: { blog: RawBlog }) => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    return (<>
        <OutsideClickDetect outsideFunc={() => setOpen(false)}>
            <div className="flex relative flex-col justify-end items-end text-white">

                <span
                    onClick={(e) => { e.preventDefault(); setOpen(!open) }}
                    className=" cursor-pointer px-1.5 py-1.5 mb-1 shadow-md text-lg  transition-all hover:text-gray-400">
                    <BsThreeDots className="text-white"/>
                </span>

                {open && <div className="top-10 -right-16 absolute py-3 px-3 rounded z-50 shadow-lg w-64 flex flex-col items-center"
                                style={{
                                    backgroundColor: "rgb(34,34,34)"
                                }}>
                    <div className="flex items-center border-b-[1px] border-gray-600 pb-2 w-full justify-center">
                        <span>Posted : </span>
                        <span>{Helper.getDateInputFormat(blog.created_time)}</span>
                    </div>
                    <Link
                        to={blog.user? `/blog/view/${blog.user.username}/${blog.id}`:''}
                        state= {{ background: location }}
                        >
                        <div className="flex items-center mb-3 font-medium mt-3">
                            {/* <BsEyeglasses className="w-6 h-auto mr-2"/> */}
                            <div>Detail</div>          
                        </div>          
                    </Link>
                    <MarkBlog blog={blog}/>
                </div>}
            </div>
        </OutsideClickDetect>

    </>)
}

interface Props{
    blog: RawBlog, 
    layout_type?: number, 
    setBlogs:  Dispatch<SetStateAction<RawBlog[]>>,
    my_blog?: boolean,
}

const BlogHeader = ({blog, layout_type, setBlogs,my_blog}:Props)=>{
    const me = MeHook.useMe();
    const blog_list_layout = StyleHook.useBlogListLayout();
    const location = useLocation();

    return <div className="justify-around flex justify-between relative py-1 mb-2 items-center">
        {
            <>
                {
                    ((blog_list_layout == BLOG_LIST_LAYOUT.VERTICAL && layout_type == undefined) || layout_type == BLOG_LIST_LAYOUT.VERTICAL) 
                    ?(
                    <>
                        <div className="absolute -left-20 " >
                            {blog.user && <Represent user={blog.user} size={60}/> }
                        </div>
                    {
                            blog.user && <div className="ml-4 mt-3 font-medium">{blog.user.username}</div>
                    }
                    </>
                    ): ((blog_list_layout == BLOG_LIST_LAYOUT.HORIZONTAL  && layout_type == undefined) || layout_type == BLOG_LIST_LAYOUT.HORIZONTAL)
                    ?(
                        <div className="absolute left-5 top-5 flex items-center text-sm font-medium">
                            {blog.user && <Represent user={blog.user} size={35}/>}
                            <Link
                                to={`/blog/view/${blog.user.username}`}
                                state= {{ background: location }}
                                >
                                <div className="ml-2 font-medium">{blog.user.username}</div>
                            </Link>
                        </div>
                    ):"" 
                }
            </>
        }
        <div className="flex items-center mt-3">
            {
                blog.is_edit && (
                    <div className="ml-4 mr-5">
                        {
                            blog.status == PRIVATE ?  <AiTwotoneLock/>
                            :blog.status == BAN ? <div className="font-medium text-red-500">Banned</div>:
                            <MdPublic/>
                        }    
                    </div>
                )
            }
            {blog.is_censored && (
                <div className="ml-4">
                    <PickBlog blog={blog}
                        setBlogs = {setBlogs}
                    />
                </div>
            )}
        </div>
        <div className="mt-3 w-full mr-3">
            <SmallMenu blog={blog}/>
        </div>
    </div>
}

export default BlogHeader;