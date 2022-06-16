import { Link, useLocation } from "react-router-dom";
import { useAsync } from "react-use";
import BlogList from "../../components/blog/BlogList";
import Represent from "../user/Represent";
import Loading from "../../components/loading/Loading";
import { Code, } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { StyleHook } from "../../store/style/hooks";
import { RawUser } from "../../store/types";
import {useState} from 'react';
import Follow from "../../components/actionUser/Follow";
import { BiRocket } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { MdTravelExplore } from "react-icons/md";


interface Response{
    code: number, 
    message: string, 
    users: RawUser[],
    following: number[],
    friends: number[],
    recent_post_numbers: {
		user_id: number,
		post_number: number
	}[],
} 

const BlogPageLayout= ({user_option,chart_name,blog_list_option}:{user_option: string, chart_name: string, blog_list_option: string})=>{
    const me = MeHook.useMe();
    const style = StyleHook.useStyle();
    const [users, setUsers] = useState<RawUser[]>([]);
    const location = useLocation();

    const state = useAsync(async()=>{
        try {

            const url = me? '/api/user/list': '/api/blog/user.list';

            const res = await Fetch.postJsonWithAccessToken<Response>(url,{
                option: user_option
            })
            if(res.data){
                const {code, message, users,following, friends,recent_post_numbers} = res.data;
                if(code == Code.SUCCESS){
                   if(me){
                        for(const user of users){
                            if(following.includes(user.id)){
                                user.is_follow = true;
                            }
                            if(friends.includes(user.id)){
                                user.is_friend = true;
                            }
                            for(const post of recent_post_numbers){
								if(user.id == post.user_id){
									user.recent_post_number = post.post_number;
									break;
								}
							}
							if(!user.recent_post_number){
								user.recent_post_number = 0;
							}

                            if(!recent_post_numbers.length){
                                user.recent_post_number = -1;
                            }

                        }
                   }
                   setUsers(users);
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }       
    },[me])

    return (
        <div className="mt-10 w-full overflow-hidden">
            {
                location.pathname != '/'  && 
                <div className="flex w-full ml-40 mb-10 font-medium text-xl">
                {
                    me && (
                        <Link to="/explore/recommended-for-you">
                            <div className={`${location.pathname == "/explore/recommended-for-you"? "text-purple-500" : "text-white "} ml-5`}>
                                <div className="flex items-center mb-1">
                                    <div >For You</div>
                                    <MdTravelExplore className="ml-3 text-pink-400"/>
                                </div>
                                {location.pathname == "/explore/recommended-for-you" && <div className="border-2 border-purple-500"></div>}
                            </div>
                        </Link>
                    )
                }
                <Link to="/explore/trending">
                    <div className={`${location.pathname == "/explore/trending"? "text-purple-500" : "text-white "} ml-5`}>
                        <div className="flex items-center mb-1">
                            <div >Trending</div>
                            <BiRocket className="ml-3 text-green-400"/>
                        </div>
                        {location.pathname == "/explore/trending" && <div className="border-2 border-purple-500"></div>}
                    </div>
                </Link>
                <Link to="/explore/staff-picks">
                    <div className={`${location.pathname == "/explore/staff-picks"? "text-purple-500" : "text-white "} ml-5`}>
                        <div  className="flex items-center mb-1">
                            <div>Staff Picks</div>
                            <BsStars className="ml-3 text-yellow-400"/>
                        </div>
                        {location.pathname == "/explore/staff-picks" && <div className="border-2 border-purple-500"></div>}
                    </div> 
                </Link> 
            </div>
            }
            
        </div>
    )
}

export default BlogPageLayout;