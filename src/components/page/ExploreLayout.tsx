import { BiRocket } from "react-icons/bi";
import { BsStars } from "react-icons/bs";
import { RiLayoutTopFill,RiLayoutMasonryFill } from "react-icons/ri";
import { MdTravelExplore } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { BLOG_LIST_LAYOUT } from "../../Constants";
import useUserList from "../../hooks/useUserList";
import { MeHook } from "../../store/me/hooks";
import { StyleHook } from "../../store/style/hooks";
import BlogList from "../blog/BlogList";
import Loading from "../loading/Loading";
import UserList from "../user/UserList";
import { StyleFunctions } from "../../store/style/functions";

const TaskBarExplorePage = ()=>{
    const me = MeHook.useMe();
    const location = useLocation();
    const blog_list_layout = StyleHook.useBlogListLayout();

    return (
        <div className="flex w-full font-medium text-xl justify-between">
            <div className="w-4/5 flex">
                {
                    me && (
                        <Link to="/explore/recommended-for-you">
                            <div className={`${location.pathname == "/explore/recommended-for-you"? "text-purple-500" : "text-white "}`}>
                                <div className="flex items-center mb-1">
                                    <div >For You</div>
                                    <MdTravelExplore className="ml-2 text-pink-400"/>
                                </div>
                                {location.pathname == "/explore/recommended-for-you" && <div className="border-[1px] border-purple-500"></div>}
                            </div>
                        </Link>
                    )
                }
                <Link to="/explore/trending">
                    <div className={`${location.pathname == "/explore/trending"? "text-purple-500" : "text-white "} ml-8`}>
                        <div className="flex items-center mb-1">
                            <div >Trending</div>
                            <BiRocket className="ml-2 text-green-400"/>
                        </div>
                        {location.pathname == "/explore/trending" && <div className="border-[1px] border-purple-500"></div>}
                    </div>
                </Link>
                <Link to="/explore/staff-picks">
                    <div className={`${location.pathname == "/explore/staff-picks"? "text-purple-500" : "text-white "} ml-8`}>
                        <div  className="flex items-center mb-1">
                            <div>Staff Picks</div>
                            <BsStars className="ml-2 text-yellow-400"/>
                        </div>
                        {location.pathname == "/explore/staff-picks" && <div className="border-[1px] border-purple-500"></div>}
                    </div> 
                </Link>
            </div> 
            <div className="flex items-center cursor-pointer">
                <div className={`${blog_list_layout == BLOG_LIST_LAYOUT.VERTICAL ? "text-white":"text-gray-500"} mr-3`}
                    onClick={()=>{StyleFunctions.setBlogListLayout(BLOG_LIST_LAYOUT.VERTICAL)}}
                >
                    <RiLayoutTopFill/>
                </div>
                <div className={`${blog_list_layout == BLOG_LIST_LAYOUT.HORIZONTAL ? "text-white":"text-gray-500"} mr-5`}
                     onClick={()=>{StyleFunctions.setBlogListLayout(BLOG_LIST_LAYOUT.HORIZONTAL)}}
                >
                    <RiLayoutMasonryFill/>
                </div>
            </div>
        </div>
    )
}

interface Props{
    blog_list_option: string,
    user_option: string,
    chart_name: string,
}

const ExploreLayout = ({blog_list_option, chart_name, user_option}: Props)=>{
    const me = MeHook.useMe();
    const blog_list_layout = StyleHook.useBlogListLayout();

    const {
        loading,
        users
    } = useUserList({user_option});

    return (
        <div className="flex mt-10 w-full">
            {
                blog_list_layout == BLOG_LIST_LAYOUT.VERTICAL
                ?(
                    <div className="w-2/3 pr-4 border-r-[1px] border-gray-700">
                        <div className="mb-10 ml-48 border-b-[1px] border-gray-700">
                            <TaskBarExplorePage/>
                        </div>
                        <div className="w-full flex justify-end"> 
                            <div className="w-2/3">
                                <BlogList 
                                    url={me? "/api/me/blog.list": "/api/blog/list"} 
                                    option={blog_list_option}
                                />
                            </div>
                            {/* <div>Try more</div> */}
                        </div>
                    </div>
                ):blog_list_layout == BLOG_LIST_LAYOUT.HORIZONTAL
                ?(
                    <div className="ml-8 border-r-[1px] border-gray-700 mb-10 w-full">
                        <div className="mb-10 border-b-[1px] border-gray-700">
                            <TaskBarExplorePage/>
                        </div>
                        <BlogList 
                            url={me? "/api/me/blog.list": "/api/blog/list"} 
                            option={blog_list_option}
                        />
                    </div>
                ):""
            }
            <div className=" ml-4 mr-4" style={{minWidth:300, minHeight:200}}>
                <div className="font-medium text-xl mb-2 text-white">{chart_name}</div>
                <div className="w-full border-b-[1px] border-gray-700 mb-3"></div>
                {
                    loading ? (
                        <div className="w-full justify-center flex">
                            <Loading/>
                        </div>
                    )
                    : < UserList users={users}/>
                }
            </div>
        </div>
    )
}

export default ExploreLayout;