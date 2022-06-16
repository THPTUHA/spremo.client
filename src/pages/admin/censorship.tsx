import {useAsync} from 'react-use'
import Fetch from '../../services/Fetch';
import { Helper } from "../../services/Helper";
import { RawLike, RawUser } from '../../store/types';
import {Code, BLOG_TYPES, ROLES, PAGINATION_OPTION, BLOG_LIST_LAYOUT} from '../../Constants';
import { Link, useParams } from 'react-router-dom';
import { StyleHook } from '../../store/style/hooks';
import {useState} from 'react';
import BlogList from '../../components/blog/BlogList';
import BlogBanned from '../blog/[name]/banned';
import BlogPicked from './blog/picked';
import BlogAdminLayout from '../../components/page/BlogAdminLayout';

const OPTIONS = [
    {id: 1, value: "picked", lable:"Picked"},
    {id: 2, value: "banned", lable:"Banned"},
]

const AdminBlogs = ()=>{
    const {option} = useParams();
    
    return (
        <BlogAdminLayout>
            <BlogList 
                url = {"/api/admin/blog.list"} 
                option = {"admin"}
                layout_type = {BLOG_LIST_LAYOUT.VERTICAL}
            />
        </BlogAdminLayout>

        // <div className="w-full ml-5 flex">
        //    <div className='w-2/3'>
        //        {
        //            option == "banned"
        //             ?<BlogBanned/>
        //             : option  == "picked"
        //             ? <BlogPicked/>
        //             :<BlogList 
        //             url = {"/api/admin/blog.list"} 
        //             option = {"admin"}/>
        //        }
        //    </div>
        //    <div className='w-1/4 ml-10'>
        //         <Link to={"/admin/blogs/picked"}>
        //             <div className='border-b-[1px] border-white mb-2'>Picked</div>
        //         </Link>
        //         <Link to={"/admin/blogs/banned"}>
        //             <div className='border-b-[1px] border-white mb-2'>Banned</div>
        //         </Link>
        //    </div>
        // </div>
    )
}

export default AdminBlogs;