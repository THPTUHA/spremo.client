import { Dispatch, SetStateAction ,useCallback} from "react";
import { BLOG_LIST_LAYOUT } from "../../../Constants";
import { RawBlog } from "../../../store/types";
import Blog from "../Blog";

interface Props{
    blogs: RawBlog[],
    setBlogs: Dispatch<SetStateAction<RawBlog[]>>
    setPage: Dispatch<SetStateAction<number>>
    my_blog?: boolean,
    lastBlogElementRef: (node: any) => void,
}

const Horizontal = ({blogs, lastBlogElementRef, setBlogs, setPage, my_blog}: Props)=>{
    return (
        <div className="w-full flex justify-between">
            <div className="w-1/3">
                {
                    blogs.map((blog,index)=>{
                        if(index % 3 == 0){
                            if(blog.is_last){
                                return (
                                    <div key={blog.id} ref={lastBlogElementRef} className="w-11/12 mb-5">
                                        <Blog blog = {blog} 
                                            setBlogs = {setBlogs}
                                            setPage = {setPage}
                                            layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                            my_blog={my_blog}
                                        />
                                    </div>
                                )
                            }
                            return (
                                <div key={blog.id} className="w-11/12 mb-5">
                                    <Blog blog = {blog} 
                                        setBlogs = {setBlogs}
                                        setPage = {setPage}
                                        layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                        my_blog={my_blog}
                                    />
                                </div>
                            )
                        }
                        return(
                            <></>
                        )
                    })
                }
            </div>
            <div className="w-1/3">
                {
                    blogs.map((blog,index)=>{
                        if(index % 3 == 1){
                            if(blog.is_last){
                                return (
                                    <div key={blog.id} ref={lastBlogElementRef} className="w-11/12 mb-5">
                                        <Blog blog = {blog} 
                                            setBlogs = {setBlogs}
                                            setPage = {setPage}
                                            layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                            my_blog={my_blog}
                                        />
                                    </div>
                                )
                            }
                            return (
                                <div key={blog.id} className="w-11/12 mb-5">
                                    <Blog blog = {blog} 
                                        setBlogs = {setBlogs}
                                        setPage = {setPage}
                                        layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                        my_blog={my_blog}
                                    />
                                </div>
                            )
                        }
                        return(
                            <></>
                        )
                    })
                }
            </div>
            <div className="w-1/3">
                {
                    blogs.map((blog,index)=>{
                        if(index % 3 == 2){
                            if(blog.is_last){
                                return (
                                    <div key={blog.id} ref={lastBlogElementRef} className="w-11/12 mb-5">
                                        <Blog blog = {blog} 
                                            setBlogs = {setBlogs}
                                            setPage = {setPage}
                                            layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                            my_blog={my_blog}
                                        />
                                    </div>
                                )
                            }
                            return (
                                <div key={blog.id} className="w-11/12 mb-5">
                                    <Blog blog = {blog} 
                                        setBlogs = {setBlogs}
                                        setPage = {setPage}
                                        layout_type ={BLOG_LIST_LAYOUT.HORIZONTAL}
                                        my_blog={my_blog}
                                    />
                                </div>
                            )
                        }
                        return(
                            <></>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Horizontal;