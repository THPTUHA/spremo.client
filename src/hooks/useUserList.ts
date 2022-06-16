import { useState } from "react";
import { useAsync } from "react-use";
import { Code } from "../Constants";
import Fetch from "../services/Fetch";
import { Toast } from "../services/Toast";
import { MeHook } from "../store/me/hooks";
import { RawUser } from "../store/types";

interface Props{
    user_option: string
}

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

const useUserList = ({user_option}:Props) =>{
    const me = MeHook.useMe();
    const [users, setUsers] = useState<RawUser[]>([]);

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

    return {
        loading: state.loading,
        users: users,
        setUsers: setUsers
    }
}

export default useUserList;