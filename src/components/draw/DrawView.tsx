import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RawBlog, RawDraw } from "../../store/types";

const DrawView = ({blog}:{blog: RawBlog})=>{

    return (
        <div className="relative">
            <div className="ml-4 mb-3">{(blog.data as RawDraw).description}</div>
            <img src = {(blog.data as RawDraw).url} className="w-full"/>
            <Link to={blog.user?`/edit/${blog.user.username}/${blog.id}?public=true`:''}>
                <span className="absolute cursor-pointer px-1.5 py-1.5 top-10 right-5 bg-gray-200 text-red-500 shadow-md text-lg rounded-full transition-all hover:bg-gray-300">
                    <FiEdit className="w-6 h-auto"/>
                </span>
            </Link>
        </div>
    )
}

export default DrawView;