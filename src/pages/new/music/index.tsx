import MusicEditor from "../../../components/music/MusicEditor";
import TextEditor from "../../../components/text.editor/TextEditor"
import { BLOG_TYPES } from "../../../Constants";
import {RawBlog, RawMusic, RawUser} from '../../../store/types';

const blog: RawBlog = {
    id: 0,
    user_id: 0,
    data:{} as RawMusic,
    last_update: 0,
    created_time: 0,
    status: 0,
    type: BLOG_TYPES.MUSIC,
    like_number: 0,
    comment_number: 0,
    user_views:[],
    selected: 0,
    emotion_id: 0,
    user: {} as RawUser,
    is_marked: false,
    is_edit: false,
    is_censored: false,
    is_last: true,
    selected_since: 0,
    allow_delete: false,
    tags: []
} ;


const CreateMusic = ()=>{
    return (
        <MusicEditor 
            blog={blog}
        />
    )
}

export default CreateMusic;