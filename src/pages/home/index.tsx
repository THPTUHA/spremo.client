import {Link} from "react-router-dom";
import { useAsync } from "react-use";
import Diary from "../../components/diary/Diary";
import DrawView from "../../components/draw/DrawView";
import TextEditer from "../../components/text.editor/TextEditor";
import VoiceRecord from "../../components/voice.recorder/VoiceRecord";
import VoiceRecorder from "../../components/voice.recorder/VoiceRecorderEdit";
import { BLOG_TYPES, Code, COLORS } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { EmotionHook } from "../../store/emotion/hooks";
import { MeHook } from "../../store/me/hooks";
import { StyleFunctions } from "../../store/style/functions";
import socketIOClient from "socket.io-client";
import { useCallback, useRef, useState } from "react";
import { SocketHook } from "../../store/socket/hooks";
import { ChatFunctions } from "../../store/chat/funtions";
import { ChatProps } from "../../interface";
import { RawLike, RawUser } from "../../store/types";
import * as _ from 'lodash';

const getTypeBlog = (blog: any)=>{
    switch(blog.type){
        case BLOG_TYPES.COMBINE:
            return <Diary blog = {blog}/>
        case BLOG_TYPES.AUDIO:
            return <VoiceRecord audio={blog}/>
        case BLOG_TYPES.DRAW:
            return <DrawView draw={blog}/>
    }
}
interface BlogResponse{
	code: number,
	message: string,
	blogs: any,
	likes:RawLike[],
	users: RawUser[],
	friend_position: number,
	following_position: number,
	friend_spe_position: number
}
const Replacement = () => {
    return (
        <div className="w-full mb-7 ">
            <div className=" animate-pulse rounded shadow px-3 py-3">
                <div className="flex items-center mb-2">
                    <div className=" flex-shrink-0 rounded-full w-14 h-14 bg-gray-200">

                    </div>
                    <div className="w-full px-4">
                        <div className="h-4  w-full rounded-lg bg-gray-200 mb-2"></div>
                        <div className="h-4  w-4/5 rounded-lg bg-gray-200"></div>
                    </div>
                </div>
                <div className=" ml-16 mr-2">
                    <div className=" w-full h-40 rounded-md bg-gray-200 mb-3">

                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = ()=>{
	const changeBGColor = ()=>{
		StyleFunctions.setBGColor(COLORS[2]);
	}
	const me = MeHook.useMe();
	const emotion = EmotionHook.useEmotion();
	const [blog_list, setBlogList] = useState<any[]>([]);
	const [emotion_temp, setEmotionTemp] = useState(0);
	const[on_loading, setOnLoading] = useState(false);
	const[load_more, setLoadMore] = useState(false);
	const [position, setPostion] = useState({
		friend_position: -1, 
		following_position: -1, 
		friend_spe_position: -1
	})

	const state = useAsync(async()=>{
		if(me){
			try {
				setOnLoading(true);
				const res = await Fetch.postJsonWithAccessToken<BlogResponse>("/api/me/blog.list",{
					emotion_id: emotion.id,
					...position
				});
				if(res.data){
					const {code,message, blogs, users, likes,following_position,friend_position,friend_spe_position} = res.data;
					if(code == Code.SUCCESS){
						for(let i = 0; i < blogs.length; ++i){
							for(let j = 0; j < likes.length ; ++j){
								if(blogs[i].id == likes[j].blog_id){
									blogs[i].emotion_id = likes[j].emotion_id;
									break;
								}
							}
							for(let j = 0; j < users.length ; ++j){
								if(blogs[i].user_id == users[j].id){
									blogs[i].user = users[j];
									break;
								}
							}
						}
						if(emotion_temp != emotion.id){
							setBlogList(blogs);
							setEmotionTemp(emotion.id);
						}else{
							setBlogList(_.unionBy(blog_list, blogs, (x:any) => x.id));
						}
						setPostion({
							following_position: following_position,
							friend_position: friend_position,
							friend_spe_position: friend_spe_position
						})
					}else{
						Toast.error(message);
					}
				}
			} catch (error) {
				console.log(error);
				Toast.error("Emotional Damage!");
			}
		}
		setOnLoading(false);
	},[emotion,load_more])

	const observer = useRef<any>();
    const lastBlogElementRef = useCallback(node => {
        if (on_loading) return;
        if (observer.current) { observer.current.disconnect() }
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting 
				&& (position.following_position > -2 
				|| position.friend_position > -2
				|| position.friend_spe_position > -2)) {
					setLoadMore(!load_more)
            }
        })
        if (node) observer.current.observe(node)
    }, [on_loading])

	return (
		<div className="mt-10 w-full">
			<div className="w-1/2 ml-40">
				{
					blog_list.map((blog: any, index: number)=>{
						if (blog_list.length == index + 1) {
							return (
								<div key={blog.id} ref={lastBlogElementRef}>
									{getTypeBlog(blog)}
								</div>
							);
						}
						return (
						<div key={blog.id}>
							{getTypeBlog(blog)}
						</div>
						)
					})
				}
			
				<div>
					{state.loading && (<>
						{[1, 2].map((e) => (<Replacement key={e} />))}
					</>)}
				</div>
			</div>
		</div>
	)
}
export default Home;