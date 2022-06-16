import BlogList from "../../../components/blog/BlogList"
import BlogAdminLayout from "../../../components/page/BlogAdminLayout";
import { BLOG_LIST_LAYOUT } from "../../../Constants";

const AdminBlogsBanned = ()=>{
    return (
        <BlogAdminLayout>
            <BlogList 
                url = {"/api/admin/blog.list"} 
                option = {"banned"}
                 layout_type = {BLOG_LIST_LAYOUT.VERTICAL}
            />
        </BlogAdminLayout>
    )
}

export default AdminBlogsBanned;