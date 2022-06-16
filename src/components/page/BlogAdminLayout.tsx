import { Link } from "react-router-dom";

const TaskBar = ()=>{

    return (
        <div className='w-1/4 ml-10'>
            <Link to={"/admin/blogs/picked"}>
                <div className='border-b-[1px] border-white mb-2'>Picked</div>
            </Link>
            <Link to={"/admin/blogs/banned"}>
                <div className='border-b-[1px] border-white mb-2'>Banned</div>
            </Link>
    </div>
    )
}

const BlogAdminLayout = (props:any)=>{
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

export default BlogAdminLayout;