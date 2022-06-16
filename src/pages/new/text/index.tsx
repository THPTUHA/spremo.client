import { useParams } from "react-router-dom";
import { useAsync } from "react-use";
import TextEditor from "../../../components/text.editor/TextEditor"
import { BLOG_TYPES } from "../../../Constants";
import {RawBlog,RawDraw, RawUser} from '../../../store/types';

const blog: RawBlog = {
    id: 0,
    user_id: 0,
    data:{} as RawDraw,
    last_update: 0,
    created_time: 0,
    status: 0,
    type: BLOG_TYPES.COMBINE,
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
const CreateTextBlog = ()=>{
    return (
        <TextEditor 
            blog={blog}
        />
    )
}

export default CreateTextBlog;