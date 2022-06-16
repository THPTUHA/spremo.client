import Content from "./Content";

const PostDetail = ({blog}: { blog: any})=>{
    return (
        <div>
            <Content blog={blog}/>
        </div>
    )
}

export default PostDetail;