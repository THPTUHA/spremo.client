import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa';
import { IoMdPause, IoMdRepeat } from 'react-icons/io';
import { Code, DRAFT, PRIVATE, PUBLIC, ROLES } from '../../Constants';
import Fetch from '../../services/Fetch';
import { Toast } from '../../services/Toast';
import { MeHook } from '../../store/me/hooks';
import BlogFooter from '../blog/BlogFooter';
import BlogHeader from '../blog/BlogHeader';
import Represent from '../blog/Represent';
import TagEdit from '../blog/TagEdit';
import { useAsync } from 'react-use';
import AudioPlay from './Audio';
import { StyleHook } from '../../store/style/hooks';
import { Link ,useLocation} from 'react-router-dom';

const VoiceRecord = ({audio}:{audio: any})=>{
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();
    let location = useLocation();

    return (
        <div className='text-white w-full bg-black pb-5 pt-3 mb-5 flex'>
            {audio.user && <Represent user={audio.user}/>}
            <div className='w-full' style={{backgroundColor:style.bg_blog_color}}>
            <BlogHeader blog={audio}/>
             <Link  
                to={audio.user? `/blog/view/${audio.user.username}/${audio.id}`:''}
                state= {{ background: location }}
                >
                 Detail
             </Link>
             {audio && <AudioPlay url={audio.data.url} id={audio.id}/>}
             <TagEdit blog={audio}/>
             <BlogFooter blog={audio}/>
            </div>
        </div>
    )
}

export default VoiceRecord;