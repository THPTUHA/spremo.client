import BlogList from '../../components/blog/BlogList';
import Loading from '../../components/loading/Loading';
import UserList from '../../components/user/UserList';
import { BLOG_LIST_LAYOUT } from '../../Constants';
import useUserList from '../../hooks/useUserList';
import { MeHook } from '../../store/me/hooks';

const Home = ()=>{
	// return (
	// 	<BlogPageLayout
	// 		chart_name = {"Following"}
	// 		user_option = {"follow"}
	// 		blog_list_option={""}
	// 	/>
	// )
	const me = MeHook.useMe();

    const {
        loading,
        users
    } = useUserList({user_option: "follow"});

    return (
        <div className="flex  w-full mt-10">
            <div className="w-2/3 pr-4 border-r-[1px] border-gray-700">
                <div className="w-full flex justify-end"> 
                    <div className="w-2/3">
                        <BlogList 
                            url={me? "/api/me/blog.list": "/api/blog/list"} 
                            option={""}
                            layout_type={BLOG_LIST_LAYOUT.VERTICAL}
                        />
                    </div>
                    {/* <div>Try more</div> */}
                </div>
            </div>
            <div className="w-1/4 h-96 ml-4">
                <div className="font-medium text-xl mb-3 text-white">Following</div>
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
export default Home;