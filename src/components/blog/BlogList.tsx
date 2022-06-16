import useBlogList from '../../hooks/useBlogList';
import Loading from '../loading/Loading';
import { useCallback, useRef } from 'react';
import Vertical from './layout/Vertical';
import { StyleHook } from '../../store/style/hooks';
import { BLOG_LIST_LAYOUT } from '../../Constants';
import Horizontal from './layout/Horizontal';

interface Props{
    url: string, 
    my_blog?: boolean,
    option?: string, 
    layout_type?: number, 
    data?:any
}

const BlogList = ({url, option,layout_type, data,my_blog}: Props)=>{
    const {
        blogs,
        loading,
        load_more,
        setPage,
        setBlogs,
    } = useBlogList(url,option, data)

    const blog_list_layout = StyleHook.useBlogListLayout();

    const observer = useRef<any>();
    const lastBlogElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) { observer.current.disconnect() }
        observer.current = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting ){
            }
            if (entries[0].isIntersecting && load_more) {
                setPage(preState => preState + 1);
            }
        })
        if (node) observer.current.observe(node)
    }, [loading])


    return (
        <div className='w-full'>
            {
                (blog_list_layout == BLOG_LIST_LAYOUT.VERTICAL && layout_type == undefined) || layout_type == BLOG_LIST_LAYOUT.VERTICAL
                    ?(
                        <Vertical blogs={blogs}
                            my_blog={my_blog}
                            lastBlogElementRef = {lastBlogElementRef}
                            setBlogs = {setBlogs} 
                            setPage = {setPage}
                        />
                    )
                :(blog_list_layout == BLOG_LIST_LAYOUT.HORIZONTAL && layout_type == undefined) || layout_type == BLOG_LIST_LAYOUT.HORIZONTAL
                    ?(
                        <Horizontal blogs={blogs}
                            lastBlogElementRef = {lastBlogElementRef}
                            setBlogs = {setBlogs} 
                            setPage = {setPage}
                            my_blog = {my_blog}
                        />
                    )
                :""
            }
            <div className='w-full justify-center flex'>
                {
                    loading && <Loading/>
                }
            </div>
        </div>
    )
}

export default BlogList;