import { useEffect, useState } from "react";
import { BiMessageSquareAdd } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { Code, DRAFT, PRIVATE, PUBLIC, ROLES } from "../../Constants";
import { MeHook } from "../../store/me/hooks";
import { StyleHook } from "../../store/style/hooks";
import BlogFooter from "../blog/BlogFooter";
import BlogHeader from "../blog/BlogHeader";
import Represent from "../blog/Represent";
import TagEdit from "../blog/TagEdit";

const DevStatusOptions = [
    {  label: "Post Public", value: PUBLIC},
    {  label: "Draft", value: DRAFT},
]

const StatusOptions = [
    {  label: "Public", value: PUBLIC},
    {  label: "Private", value: PRIVATE},
]

const DrawView = ({draw}:{draw:any})=>{
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();

    const location = useLocation();

    return (
        <div className=" w-full mb-10 flex"  style={{color:style.text_color}}>
            {draw.user && <Represent user={draw.user}/>}
            <div className="w-full" style={{backgroundColor:style.bg_blog_color}}>
                <BlogHeader blog={draw}/>
                <div>
                    <BiMessageSquareAdd/>
                </div>
                <div className="relative">
                    <Link
                        to={draw.user? `/blog/view/${draw.user.username}/${draw.id}`:''}
                        state= {{ background: location }}
                        >
                        <img src = {draw.data.url} className="w-full"/>
                    </Link>
                    <Link to={draw.user?`/edit/${draw.user.username}/${draw.id}?public=true`:''}>
                        <span className="absolute cursor-pointer px-1.5 py-1.5 top-5 right-5 bg-gray-200 text-red-500 shadow-md text-lg rounded-full transition-all hover:bg-gray-300">
                            <FiEdit className="w-6 h-auto"/>
                        </span>
                    </Link>
                </div>
                <TagEdit blog={draw}/>
                <BlogFooter blog={draw}/>
            </div>
        </div>
    )
}

export default DrawView;