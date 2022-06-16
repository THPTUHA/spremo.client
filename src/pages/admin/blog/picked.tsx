import BlogList from "../../../components/blog/BlogList"
import BlogAdminLayout from "../../../components/page/BlogAdminLayout";
import { BLOG_LIST_LAYOUT } from "../../../Constants";

const AdminBlogsStaffPick = ()=>{
    return (
        <BlogAdminLayout>
            <BlogList 
                 url={"/api/admin/blog.list"} 
                 option={"staff-picks"}
                 layout_type = {BLOG_LIST_LAYOUT.VERTICAL}
            />
        </BlogAdminLayout>
    )
}

export default AdminBlogsStaffPick;