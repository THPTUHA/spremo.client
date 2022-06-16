import { RawBlog, RawNote } from "../../store/types";
import Content from "../post/Content";

const Note = ({blog}:{blog: RawBlog})=>{
    return (
        <div className='ml-5'>
            <div className="text-4xl font-bold">{(blog.data as RawNote).title}</div>
            <Content blog={blog}/>
        </div>
    )
}

export default Note;