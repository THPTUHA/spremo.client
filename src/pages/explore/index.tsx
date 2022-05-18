import { Link, Route, Routes, useLocation } from "react-router-dom";
import { useAsync } from "react-use";
import Represent from "../../components/blog/Represent";
import StaffPick from "../../components/blog/StaffPick";
import Trending from "../../components/blog/Trending";
import LoadingNormal from "../../components/loading/LoadingNormal";
import { Code } from "../../Constants";
import Fetch from "../../services/Fetch";
import { Toast } from "../../services/Toast";
import { MeHook } from "../../store/me/hooks";
import { StyleFunctions } from "../../store/style/functions";
import { StyleHook } from "../../store/style/hooks";
import { RawUser } from "../../store/types";

const routes = [
    {
        key: 1,
        path: "/explore/trending",
        main: <Trending/>
    },
    {
        key: 2,
        path: "/explore/staff-picks",
        main: <StaffPick/>
    },
];

const Explore= ()=>{
    const me = MeHook.useMe();
    const reset = StyleHook.useReset();
    const style = StyleHook.useStyle();

    const location = useLocation();
    const state = useAsync(async()=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string, users: RawUser[],follows: any[]}>('/api/user/top',{
                user_id: me?me.id:0
            })
            if(res.data){
                const {code, message, users,follows} = res.data;
                console.log("USER----", users);
                if(code == Code.SUCCESS){
                    for(let i = 0 ; i < users.length ; ++i){
                        if(users[i].id == me?.id){
                            users[i].follow_status = -1;
                        }else{
                            for(let j =0 ; j < follows.length; ++j){
                                if(follows[j].user_follow == users[i].id){
                                    users[i].follow_status = 1; break;
                                }
                            }
                        }
                    }
                    return {
                        users: users
                    }
                }
                Toast.error(message);
            }
        } catch (error) {
            console.log(error);
            Toast.error("Emotional Damage!");
        }
        return{
            users: []
        }            
    },[reset])

    const handleUnFollow = async(user_id: number)=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string}>('/api/relationship/unfollow',{
                user_id: user_id
            });
            if(res.data && res.data.code == Code.SUCCESS){
                StyleFunctions.reset();
            }   
            Toast.error(res.data.message);
        } catch (error) {
            Toast.error("ERROR");
        }
    }

    const handleFollow = async(user_id: number)=>{
        try {
            const res = await Fetch.postJsonWithAccessToken<{code: number, message: string,follow_status: number}>('/api/relationship/follow',{
                user_id: user_id
            });

            if(res.data && res.data.code == Code.SUCCESS){
                StyleFunctions.reset();
            }   
            Toast.error(res.data.message);
        } catch (error) {
            Toast.error("ERROR");
        }
    }

    return (
        <div className="mt-10 w-full overflow-hidden">
            <div className="flex w-full ml-40 mb-3 font-medium text-xl">
                <div className="ml-5">
                    <Link to="/explore/trending">Trending</Link>
                </div>
                <div className="ml-10">
                    <Link to="/explore/staff-picks">Staff Picks</Link>
                </div>  
            </div>
            <div className="flex  w-full justify-around">
                <div className="w-1/2 ml-40 ">
                    {
                        location.pathname === "/explore/trending"  && <Trending/>
                    }
                    {
                        location.pathname === "/explore/staff-picks"  && <StaffPick/>
                    }
                    <div>Try more</div>
                </div>
                <div className="w-1/4 h-96" style={{backgroundColor: style.bg_blog_color}}>
                    <div className="font-medium text-2xl ml-8 mb-4 mt-4">Top bloger</div>
                    {state.loading && <LoadingNormal/>}
                    { state.value && (
                    <table className="">
                       <tbody>
                       {
                            state.value.users.map(user => (
                                <tr key={user.id} className="flex items-center mb-4">
                                    <th><Represent user={user} re_size={true}/></th>
                                    <th className="font-medium -ml-3">{user.username}</th>
                                    <th className="ml-3">
                                    {
                                        user.follow_status > 0 ? <button onClick={()=>{handleUnFollow(user.id)}}>UnFollow</button>
                                        : !user.follow_status ? <button onClick={()=>{handleFollow(user.id)}}>Follow</button>
                                        : ""
                                    }
                                    </th>
                                </tr>
                            ))
                        }
                       </tbody>
                    </table>
                )}
                </div>
            </div>
        </div>
    )
}

export default Explore;