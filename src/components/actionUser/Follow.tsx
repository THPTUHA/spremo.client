import { Dispatch, SetStateAction, useState } from "react";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { LoadingFunctions } from "../../store/loading/functions";
import { StyleFunctions } from "../../store/style/functions";
import { RawUser } from "../../store/types";


const Follow = ({user,in_chart}: {user: RawUser, in_chart?: boolean})=>{
    const [user_temp, setUserTemp] = useState(user);

    const handleUnFollow = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/relationship/unfollow',{
                user_id: user_temp.id
            });
            if(res.data && res.data.code == Code.SUCCESS){
                const new_user = {
                    ...user_temp,
                    is_friend: false,
                    is_follow: false
                }
                setUserTemp(new_user);
                StyleFunctions.reset();
                // LoadingFunctions.reloadTopUser();
            }   
            Toast.error(res.data.message);
        } catch (error) {
            console.log(error);
            Toast.error("ERROR");
        }
    }

    const handleFollow = async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string,is_follow: boolean,is_friend: boolean}>('/api/relationship/follow',{
                user_id: user_temp.id
            });

            if(res.data && res.data.code == Code.SUCCESS){
                const {is_follow, is_friend} = res.data;
                const new_user = {
                    ...user_temp,
                    is_friend,
                    is_follow
                }

                setUserTemp(new_user);
                StyleFunctions.reset();
                // LoadingFunctions.reloadTopUser();
            } 

            Toast.error(res.data.message);
        } catch (error) {
            console.log(error);
            Toast.error("ERROR");
        }
    }

    return(
        <div >
        {
            in_chart? (
                <div>
                    {
                        user_temp.is_friend
                            ?  <button onClick={handleUnFollow} className="text-purple-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                                Friend
                                </button> 
                        :user_temp.is_follow 
                            ? <button onClick={handleUnFollow}  className="text-purple-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                                Following
                                </button>
                        : <button onClick={handleFollow}  className="text-purple-500 font-medium ml-3 px-1  border-rounded-lg text-white">
                            Follow
                        </button>
                    }
                </div>
            )
            :(
                <div>
                    {
                        user_temp.is_friend
                            ?  <button onClick={handleUnFollow} className="bg-white  ml-3 px-2  rounded text-black">
                                Friend
                                </button> 
                        :user_temp.is_follow 
                            ? <button onClick={handleUnFollow}  className="bg-white ml-3 px-2  rounded text-black">
                                Following
                                </button>
                        : <button onClick={handleFollow}  className="bg-white ml-3 px-2  rounded text-black">
                            Follow
                        </button>
                    }
                </div>
            )
        }
        </div>
    )
}

export default Follow;