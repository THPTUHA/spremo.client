import { Dispatch, SetStateAction } from "react";
import { useTransition, animated } from "react-spring";
import { BLOG_LIST_LAYOUT } from "../../../Constants";
import { RawBlog } from "../../../store/types";
import Blog from "../Blog";

interface Props{
    blogs: RawBlog[],
    my_blog?: boolean,
    setBlogs: Dispatch<SetStateAction<RawBlog[]>>
    setPage: Dispatch<SetStateAction<number>>
    lastBlogElementRef: (node: any) => void
}

const Vertical = ({blogs, lastBlogElementRef, setBlogs,setPage,my_blog }:Props)=>{
    
    const transitions = useTransition(blogs, {
        from: { opacity: 1 },
        enter: { opacity: 1 },
        leave: {opacity: 0, x: -150, delay:200},
      //   config: { tension: 220, friction: 120 },
      //   delay: 200,
      //   config: config.molasses,
          // trail:400
      //   onRest: () => setItems([]),
    })

    return (
        <div  className='w-full'>
            {
                transitions((style, blog) => {
                    if(blog.is_last){
                       return (
                           <animated.div
                               style={style}>
                               <div key={blog.id} ref={lastBlogElementRef} className="mb-10">
                                   <Blog blog = {blog} 
                                        setBlogs = {setBlogs}
                                        setPage = {setPage}
                                        layout_type = {BLOG_LIST_LAYOUT.VERTICAL}
                                        my_blog = {my_blog}
                                   />
                               </div>
                           </animated.div>
                       )
                   }
                   return (
                       <animated.div
                           style={style}>
                           <div key={blog.id} className="mb-10">
                                <Blog blog = {blog} 
                                    setBlogs = {setBlogs}
                                    setPage = {setPage}
                                    layout_type={BLOG_LIST_LAYOUT.VERTICAL}                                    
                                />
                           </div>
                       </animated.div>
                   )
                })
            }
        </div>
    )
}

export default Vertical;