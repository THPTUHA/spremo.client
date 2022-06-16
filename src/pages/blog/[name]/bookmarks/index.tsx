import BlogList from "../../../../components/blog/BlogList";
import MyBlogLayout from "../../../../components/page/MyBlogLayout";
import { BLOG_LIST_LAYOUT } from "../../../../Constants";

const BookMark = ()=>{
    return (
        <MyBlogLayout>
            <BlogList 
                url={"/api/me/blog.list"}
                option={"bookmark"}
                layout_type={BLOG_LIST_LAYOUT.VERTICAL}
            />
        </MyBlogLayout>
    )
}

export default BookMark;