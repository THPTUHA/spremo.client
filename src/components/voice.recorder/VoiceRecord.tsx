import { RawBlog, RawVoiceRecorder } from '../../store/types';
import AudioPlay from './AudioPlay';

const VoiceRecord = ({blog}:{blog: RawBlog})=>{
    const data = (blog.data as RawVoiceRecorder);
    
    return (
        <div className='text-white w-full pb-5 pt-3 mb-5'>
            <div className='text-xl text-white ml-5 font-medium mb-3'>{data.title}</div>
            <div className='text-white ml-5 italic'>{data.description}</div>
            <div className='flex items-center justify-center mt-5 flex-wrap'>
                <img src={data.background} className="w-24 h-24 rounded "/>
                <div className='w-3/4'>
                    {blog && <AudioPlay url={data.url} id={blog.id}/>}
                </div>
            </div>
        </div>
    )
}

export default VoiceRecord;