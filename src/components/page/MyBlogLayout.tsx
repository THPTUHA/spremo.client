import { Link } from "react-router-dom";
import { ROLES } from "../../Constants";
import { ChatFunctions } from "../../store/chat/funtions";
import { EmtionFunctions } from "../../store/emotion/functions";
import { EmotionHook } from "../../store/emotion/hooks";
import { MeFunctions } from "../../store/me/functions";
import { MeHook } from "../../store/me/hooks";
import { SettingFunctions } from "../../store/setting/function";
import { SocketHook } from "../../store/socket/hooks";

const TaskBar = ()=>{
    const me = MeHook.useMe();
    const socket = SocketHook.useSocket();

    const handleLogOut = ()=>{
        MeFunctions.logout();
        socket.disconnect()
        ChatFunctions.close();
        EmtionFunctions.reset();
        SettingFunctions.reset();
    }

    return (
        <div className="h-96 ml-4">
            {
                me?.role == ROLES.ADMIN && (
                    <Link to={`/admin/users/all`}>
                        <div className="border-b-[1px] border-white mb-3">Admin</div>
                    </Link>
                )
            }
            {
                me?.role == ROLES.CENSOR && (
                    <Link to={`/admin/blogs/all`}>
                        <div className="border-b-[1px] border-white mb-3">Censor</div>
                    </Link>
                )
            }
            <Link to={`/settings/apperance`}>
                <div className="border-b-[1px] border-white mb-3">Settings</div>
            </Link>
            {
                me?.role == ROLES.DEVELOPER && (
                    <div className="border-b-[1px] border-white mb-3">
                        <Link to={`/blog/${me?.username}/active`}>
                            <div >Active</div>
                        </Link>
                    </div>
                )
            }
            <div className="cursor-pointer border-b-[1px] border-white mb-3">
                <Link to={`/blog/${me?.username}/bookmarks`}>
                    <div >Bookmarks</div>
                </Link>
            </div>
            <div className="cursor-pointer border-b-[1px] border-white mb-3" onClick={handleLogOut}>
                Logout
            </div>
        </div>
    )
}
const MyBlogLayout = (props:any)=>{
    return (
        <div className="flex w-full mt-10">
            <div className="w-2/3 pr-4 border-r-[1px] border-gray-700">
                <div className="w-full flex justify-end"> 
                    <div className="w-2/3">
                        {props.children}
                    </div>
                    {/* <div>Try more</div> */}
                </div>
            </div>
            <div className="w-1/4">
                <TaskBar/>
            </div>
        </div>
    )
}

export default MyBlogLayout;