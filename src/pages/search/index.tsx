import BlogList from "../../components/blog/BlogList";
import {useParams} from 'react-router-dom';
import { StyleHook } from "../../store/style/hooks";
import { BLOG_LIST_LAYOUT } from "../../Constants";
import { MeHook } from "../../store/me/hooks";

const Search = ()=>{
    const me = MeHook.useMe();
    const {q} = useParams();
    const blog_list_layout = StyleHook.useBlogListLayout();

    return (
        <div className="w-full mt-10 flex flex-col">
            <div className="text-4xl font-medium text-white ml-20 ">#{q}</div>
            {
                blog_list_layout == BLOG_LIST_LAYOUT.VERTICAL && 
                <div className="w-1/3 ml-40 mt-10">
                    <BlogList 
                        url={me ? "/api/blog/auth.list": "/api/blog/list"} 
                    />
                </div>
            }

            {
                blog_list_layout == BLOG_LIST_LAYOUT.HORIZONTAL && 
                <div className="w-2/3 ml-40 mt-10">
                    <BlogList 
                        url={me ? "/api/blog/auth.list": "/api/blog/list"} 
                    />
                </div>
            }
        </div>
    )
}

export default Search;