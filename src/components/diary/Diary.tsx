import { Link, useLocation } from 'react-router-dom';
import { StyleHook } from '../../store/style/hooks';
import BlogFooter from '../blog/BlogFooter';
import BlogHeader from '../blog/BlogHeader';
import Represent from '../blog/Represent';
import TagEdit from '../blog/TagEdit';
import Content from './Content';


const Diary = ({blog}:{blog: any})=>{
    const style = StyleHook.useStyle();

    let location = useLocation();

    return (
        <div className='pb-5 mb-10 w-full flex' style={{color:style.text_color}}>
            {blog.user && <Represent user={blog.user}/>}
            <div className='w-full rounded' style={{backgroundColor:style.bg_blog_color}}>
                <BlogHeader blog={blog}/>
                <Link
                    to={blog.user? `/blog/view/${blog.user.username}/${blog.id}`:''}
                    state= {{ background: location }}
                    >
                   <div className='ml-5'>
                        <Content blog={blog}/>
                   </div>
                </Link>
                <div className='text-black'>
                    <div className="border-[1px]"></div>
                    <TagEdit blog={blog}/>
                </div>
                <BlogFooter blog={blog}/>
            </div>
        </div>
    )
}

export default Diary;