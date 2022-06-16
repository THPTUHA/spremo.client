import BlogList from "../../../components/blog/BlogList";
import MyBlogLayout from "../../../components/page/MyBlogLayout";
import { BLOG_LIST_LAYOUT } from "../../../Constants";

const MyBlog = ()=>{

    return (
        <MyBlogLayout>
            <BlogList 
                url={"/api/me/blog.list"} 
                option={"my-blog"}
                layout_type={BLOG_LIST_LAYOUT.VERTICAL}
            />
        </MyBlogLayout>
    )
}

export default MyBlog;